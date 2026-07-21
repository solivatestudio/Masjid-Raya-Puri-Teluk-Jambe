import { getSql } from '@/db';

type SqlClient = ReturnType<typeof getSql>;

export interface PublicKhutbah {
  id: string;
  schedule_date: string;
  khatib: string;
  muadzin: string | null;
  theme: string | null;
}

export async function getPublicKhutbahSchedule(sql: SqlClient, limit = 4): Promise<PublicKhutbah[]> {
  const rows = (await (sql as any).query(
    `
      SELECT id, schedule_date, khatib, muadzin, theme
      FROM khutbah_schedule
      WHERE schedule_date >= CURRENT_DATE
      ORDER BY schedule_date ASC
      LIMIT $1
    `,
    [limit]
  )) as PublicKhutbah[];

  return rows;
}
