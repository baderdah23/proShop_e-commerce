import express, {
  type Request,
  type Response,
  type Express,
  NextFunction,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRouter from "./models/auth/auth.routes.js";
import categoryRouter from "./models/category/category.routes.js";
import subCategoryRouter from "./models/subCategory/subCategory.routes.js";
import apiError from "./utils/apiError.js";
import { globalError } from "./middlewares/errorMiddleware.js";
import brandsRouter from "./models/brand/brand.routes.js";
import productRouter from "./models/product/product.routes.js";
import userRouter from "./models/user/user.routes.js";
import reviewRouter from "./models/rating&reviews/reviews.routes.js";
import couponRouter from "./models/coupons/coupons.routes.js";
import cartRouter from "./models/cart/cart.routes.js";
import orderRouter from "./models/orders/orders.routes.js";
import addressRouter from "./models/address/address.routes.js";
import wishlistRouter from "./models/wishlist/wishlist.routes.js";
import paymentRouter from "./models/payments/payments.routes.js";
import { stripeWebhook } from "./models/payments/payments.controller.js";

const app: Express = express();
const allowedOrigins = new Set(
  (process.env.CORS_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Stripe webhook must receive the raw request body for signature
// verification, so it is registered before express.json().
app.post("/payments/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome !");
});

app.use(categoryRouter);
app.use(subCategoryRouter);
app.use(brandsRouter);
app.use(productRouter);
app.use(userRouter);
app.use(reviewRouter);
app.use(couponRouter);
app.use(cartRouter);
app.use(orderRouter);
app.use(authRouter);
app.use(addressRouter);
app.use(wishlistRouter);
app.use(paymentRouter);

app.all("/*splat", (req: Request, res: Response, next: NextFunction) => {
  const error = new apiError(`Can't find this route ${req.originalUrl}`, 400);
  next(error);
});

app.use(globalError);

export default app;

// On Vercel the app is served as a serverless function via api/index.ts,
// so we only bind a local listener when running as a standalone process.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 8000;
  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  // handle rejected promises outside the express application
  process.on("unhandledRejection", (err: Error) => {
    console.log(`unhandledRejection Error: ${err.name} | ${err.message}`);
    server.close(() => {
      process.exit(1);
    });
  });
}
