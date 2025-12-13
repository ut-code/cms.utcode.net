import * as v from "valibot";

const TursoEnv = v.union([
	v.object({
		DATABASE_URL: v.pipe(v.string(), v.startsWith("file:")),
		DATABASE_AUTH_TOKEN: v.union([v.string(), v.undefined()]),
	}),
	v.object({
		DATABASE_URL: v.pipe(v.string(), v.startsWith("libsql:")),
		DATABASE_AUTH_TOKEN: v.string(),
	}),
]);

const Env = v.intersect([TursoEnv]);

export const env = v.parse(Env, process.env);
