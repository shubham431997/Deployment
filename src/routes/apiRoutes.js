import express from 'express'
import userController from '../controllers/user.controller.js';
import categoryController from '../controllers/category.controller.js';
import productController from '../controllers/product.controller.js';
import upload from '../_middleware/upload.js';
import cartController from '../controllers/cart.controller.js';
import { verifyUser, verifyAdmin } from '../_middleware/authentication.js'
import orderController from '../controllers/order.controller.js';
import bannerImageController from '../controllers/bannerImage.controller.js';
import dealController from '../controllers/deal.controller.js';
import addressController from '../controllers/address.controller.js';
import holidayController from '../controllers/holiday.controller.js';
import feedbackController from '../controllers/feedback.controller.js';
import paymentController from '../controllers/payment.controller.js';
import NotificationController from '../controllers/notification.controller.js';
import dashboardController from '../controllers/dashboard.controller.js';

const router = express.Router();

//Users Routes
router.route('/register-admin').post(userController.admin);
router.route('/register-user').post(userController.user);
router.route('/login').post(userController.login);
router.route('/users').get(verifyAdmin,userController.getAllUsers);
router.route("/user").get(verifyAdmin,userController.getUserById);
router.route("/user/:id").delete(verifyAdmin, userController.remove);
router.route("/userdetails").get(verifyUser,userController.getUserById);
router.route("/admin-update/:id").put(userController.update);
router.route("/user-update/:id").put(userController.update);
//send OTP to mail,verify and reset-password Routes
router.route('/forgot-password/send-otp').post(userController.sendOtp)
router.route('/forgot-password/verify-otp').post(userController.verifyOtp);
router.route('/forgot-password/reset-password').post( userController.resetPassword);
router.post('/verify-password', userController.verifyPassword);

//Category Routes
//router.route('/category').post(categoryController.createCategory);
router.post('/category',upload.single('image'),categoryController.createCategory);
router.route('/categories').get(categoryController.getAllCategories);
router.route('/category/:id').delete(categoryController.deleteCategory);
router.put('/category/:id', upload.single('image'),categoryController.updateCategory);
router.route('/category/:id').get(categoryController.getById);

//Product Routes
//router.route('/product',upload.single('image')).post(productController.createProduct);
router.post('/products', upload.single('image'), productController.createProduct);
//products get by category id
router.route('/category/products/:id').get(productController.getAllProductsByCategoryID);
//product get by product id
router.route('/products/:id').get(productController.getProductById);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.route('/products/:id').delete(productController.deleteProduct);
router.route('/products').get(productController.getAllProducts);

//Cart Routes
router.route('/cart').post(verifyUser, cartController.addToCart);
router.route('/cart/bulk-add').post(verifyUser, cartController.bulkAddToCart);
router.route('/cart').get(verifyUser ,cartController.getCart);
router.route('/cart/clear').delete(verifyUser, cartController.clearCart);
router.route('/cart/:id').delete(cartController.removeCartItem);
router.route('/cart/:id').put(cartController.updateCartItem);

//Banner Routes
router.route('/bannerImage').get(bannerImageController.getAllBannerImages);
router.post('/bannerImage',upload.single('image'),bannerImageController.createBannerImage);
router.route('/bannerImage/:id').delete(verifyAdmin,bannerImageController.deleteBannerImage);

//Order Routes
router.route('/order').post(verifyUser,orderController.createOrder);
router.route('/order').get(verifyUser,orderController.getUserOrders);
router.route('/orders').get(orderController.getAllOrders);
router.route('/order/:orderId').put(verifyUser,orderController.updateOrderStatus);
router.route('/order/:id').get(verifyUser,orderController.getOrderById);
router.route('/order/:id').delete(verifyUser,orderController.deleteOrder);
router.route('/order/admin/:id').get(verifyAdmin,orderController.getOrderByIdAndUserDeatils);


//deals apii
router.route('/deal').get(dealController.getAllDeals);
router.post('/deal',upload.single('image'),dealController.createDeal);

//Address Apii
router.route('/address').get(verifyUser,addressController.getAddressesByUserId);
router.route('/address').post(verifyUser,addressController.createAddress);
router.route('/address/:id').put(verifyUser,addressController.updateAddress);
router.route('/address/:id').delete(verifyUser,addressController.deleteAddress);

//Holidays Apii
router.route('/holiday').get(holidayController.getAllHolidays);
router.route('/holiday').post(holidayController.createHoliday);
router.route('/holiday/:id').delete(holidayController.deleteHoliday);
router.route('/holiday/:id').put(holidayController.updateHoliday);

//Feedback Apii 
router.route('/account-del-request').post(verifyUser,feedbackController.createFeedback);

// Payment api
router.route('/payment/stripe').post(verifyUser, paymentController.stripePayment);
router.route('/payment/ideal').post(verifyUser, paymentController.idealPayment);

//Notifications Apii
router.route("/register-token").post( verifyUser,NotificationController.registerToken);
router.route("/register-admintoken").post(verifyAdmin, NotificationController.registerAdminToken);
router.route("/get-admintoken").get(verifyAdmin, NotificationController.getAdminTokenById);
router.post("/send-notification", NotificationController.sendNotification);

//Dashboard Apis
router.get("/dashboard", verifyAdmin, dashboardController.getDashboardData);
router.get("/dashboard/top-sold-products", verifyAdmin, dashboardController.getTopSoldProducts);
router.route("/top-sold-products/week").get(verifyAdmin, dashboardController.getTopSoldProductsByWeek);
router.route("/top-sold-products/month").get(verifyAdmin, dashboardController.getTopSoldProductsByMonth);
export default router;
