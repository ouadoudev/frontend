import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import lessonReducer from "./lessonSlice";
import courseReducer from "./courseSlice";
import subjectReducer from "./subjectSlice";
import orderReducer from "./enroll";
import notificationsReducer from "./notificationSlice";
import courseProgressReducer from "./courseProgressSlice";
import todoReducer from "./todoSlice";
import contactReducer from "./contactSlice";
import reviewReducer from "./reviewSlice";
import questionReducer from "./questionSlice";
import quizReducer from "./quizSlice";
import exerciseReducer from "./exerciseSlice";
import passwordResetReducer from "./passwordResetSlice";
import conversationReducer from "./conversationSlice";
import messageReducer from "./messageSlice";
import subscriptionReducer from "./subscriptionSlice";
import analyticsReducer from "./adminanalyticsSlice";
import testimonialReducer from "./testimonialSlice"
import partenaireReducer from "./partenaireSlice"
import bankAccountReducer from "./bankSlice"
import examReducer from "./examSlice"
import revenueReducer from "./revenueSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    lesson: lessonReducer,
    courses: courseReducer,
    subjects: subjectReducer,
    orders: orderReducer,
    notifications: notificationsReducer,
    courseProgress: courseProgressReducer,
    todos: todoReducer,
    contact: contactReducer,
    reviews: reviewReducer,
    question: questionReducer,
    quiz: quizReducer,
    exercises: exerciseReducer,
    passwordReset: passwordResetReducer,
    conversations: conversationReducer,
    messages: messageReducer,
    subscription: subscriptionReducer,
    analytics: analyticsReducer,
    testimonials: testimonialReducer,
    partenaires:partenaireReducer,
    bankAccounts :bankAccountReducer,
    exam: examReducer,
    revenue: revenueReducer,
  },
});

export default store;
