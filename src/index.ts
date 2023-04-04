import { root } from "./root";
import { Query, Int, OpenAPIRoute } from "@cloudflare/itty-router-openapi";
const router = root();

const Story = {
	title: String,
	url: String,
	user: String,
	domain: String,
	points: Int,
	time: Int,
	time_ago: String,
	comments_count: Int,
	type: String,
	id: Int
};

export class TopStories extends OpenAPIRoute {
  static schema = {
	operationId: "topHeadlines",
	summary: "Collects the current top stories.",
	parameters: {
	  count: Query(Int, {
		description: "number of stories to return.",
		default: 10,
		required: false,
	  }),
	},
	responses: {
	  200: {
		schema: {
		  headlines: [Story],
		},
	  },
	},
  };
  async handle(_request: Request, _env: any, _ctx: any, data: Record<string, any>) {
	const { count } = data;
	const response = await fetch("https://api.hnpwa.com/v0/news/1.json");
	const json: any[] = await response.json();
	const headlines = json.slice(0, count);
	return { headlines };
  }
}
router.get("/topHeadlines", TopStories);

export default {
  fetch: router.handle,
};
