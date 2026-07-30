import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 250 },
    { duration: "1m", target: 500 },
    { duration: "1m", target: 1000 },
    { duration: "1m", target: 0 },
  ],
};
export default function () {
  const res = http.get("http://localhost:4000/products/");

  check(res, {
    "Status is 200": (r) => r.status === 200,
    "Response time < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1);
}
