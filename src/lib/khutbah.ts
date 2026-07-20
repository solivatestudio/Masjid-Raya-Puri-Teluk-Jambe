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
      WITH ranked AS (
        SELECT
          id,
          schedule_date,
          khatib,
          muadzin,
          theme,
          CASE WHEN schedule_date >= CURRENT_DATE THEN 0 ELSE 1 END AS date_group
        FROM khutbah_schedule
      )
      SELECT id, schedule_date, khatib, muadzin, theme
      FROM ranked
      ORDER BY
        date_group ASC,
        CASE WHEN date_group = 0 THEN schedule_date END ASC,
        CASE WHEN date_group = 1 THEN schedule_date END DESC
      LIMIT $1
    `,
    [limit]
  )) as PublicKhutbah[];

  return rows;
}
