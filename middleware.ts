  export { default } from "next-auth/middleware";

  export const config = {
    matcher: ["/favorites", "/watched", "/my-reviews"],
  };