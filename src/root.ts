import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import pack from "../package.json";

export function root(
  router = OpenAPIRouter({
	schema: {
	  info: {
		title: (pack as any).aiPlugin.name,
		version: pack.version,
	  },
	},
  })
) {
  router.original.get("/.well-known/ai-plugin.json", (request: Request) => {
	const plugin = (pack as any).aiPlugin as any;
	return new Response(
	  JSON.stringify({
		api: {
		  type: "openapi",
		  has_user_authentication: false,
		  url: `https://${request.headers.get("host")}/openapi.json`,
		  ...plugin.api,
		},
		auth: {
		  type: "none",
		  ...plugin.auth,
		},
		logo_url: `https://${request.headers.get("host")}/.well-known/logo.png`,
		name_for_human: plugin.name,
		description_for_human: (pack as any).description,
		description_for_model: plugin.prompt,
		name_for_model: pack.name.replaceAll("-", "_"), // just use the package name
		schema_version: "v1",
		contact_email: plugin.contact_email,
		legal_info_url: plugin.legal_info_url,
	  })
	);
  });
  return router;
}
