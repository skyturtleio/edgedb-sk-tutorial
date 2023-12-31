import { fail } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import type { Actions, PageServerLoad } from "./$types";

export const load = (({ cookies }) => {
	const id = cookies.get("userid");

	if (!id) {
		cookies.set("userid", crypto.randomUUID(), { path: "/" });
	}

	return {
		todos: db.getTodos(id) ?? [],
	};
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ cookies, request }) => {
		const data = await request.formData();

		try {
			db.createTodo(cookies.get("userid"), data.get("description"));
		} catch (error) {
			return fail(422, {
				description: data.get("description"),
				error: error.message,
			});
		}
	},

	delete: async ({ cookies, request }) => {
		const data = await request.formData();
		db.deleteTodo(cookies.get("userid"), data.get("id"));
	},
} satisfies Actions;
