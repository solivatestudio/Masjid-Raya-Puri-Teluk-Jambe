import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSql } from "@/db";
import { requireCmsAuth, authErrorResponse } from "@/lib/rbac";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const allowedTransitions: Record<string, string[]> = {
  pending: ["approved", "rejected", "cancelled"],
  approved: ["cancelled"],
  rejected: [],
  cancelled: [],
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireCmsAuth();
    const sql = getSql();
    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes } = body;
    if (!status || !["approved", "rejected", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Status harus approved, rejected, atau cancelled" },
        { status: 400 },
      );
    }

    const currentRows = (await (sql as any).query(
      `SELECT status FROM bookings WHERE id = $1`,
      [id],
    )) as any[];
    const currentStatus = currentRows[0]?.status;
    if (!currentStatus)
      return NextResponse.json(
        { error: "Booking tidak ditemukan" },
        { status: 404 },
      );
    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json(
        {
          error: `Status booking ${currentStatus} tidak bisa diubah menjadi ${status}`,
        },
        { status: 409 },
      );
    }

    if (status === "approved") {
      const conflictRows = (await (sql as any).query(
        `SELECT id FROM bookings WHERE id <> $1 AND date = (SELECT date FROM bookings WHERE id = $1) AND status = 'approved' LIMIT 1`,
        [id],
      )) as any[];
      if (conflictRows[0]) {
        return NextResponse.json(
          { error: "Tanggal ini sudah memiliki booking approved lain" },
          { status: 409 },
        );
      }
    }

    const rows = (await (sql as any).query(
      `UPDATE bookings SET status = $1, admin_notes = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [status, adminNotes || "", id],
    )) as any[];
    const row = rows[0];
    revalidatePath("/", "page");
    return NextResponse.json(row);
  } catch (error) {
    return authErrorResponse(error);
  }
}
