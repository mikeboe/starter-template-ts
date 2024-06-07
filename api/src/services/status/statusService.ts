import postgresDb from "../../db/postgresDb";

export const getStatus = async () => {
    const result = await postgresDb.query('SELECT $1::text as message', ['Hello world!']);
    return result.rows[0].message;
};
