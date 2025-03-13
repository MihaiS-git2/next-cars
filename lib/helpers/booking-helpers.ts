import { ObjectId } from "mongodb";
import { connectDB } from "../mongoDb";
import { IDatesInterval } from "../definitions";

export async function createBooking(customerId: string, carId: string, driverId: string, timeInterval: IDatesInterval, status: string, totalAmount: number): Promise<string> {
    const newBooking = {
        customer: new ObjectId(customerId!),
        car: new ObjectId(carId),
        driver: new ObjectId(driverId),
        timeInterval: { start: timeInterval.start, end: timeInterval.end },
        status: 'Pending',
        totalAmount: totalAmount,
    };
    const db = await connectDB();
    const bookingResult = await db.collection('bookings').insertOne(newBooking);
    if (!bookingResult) throw new Error("Failed to save the booking");

    return bookingResult.insertedId.toString();
}

export async function saveBookingInRelatedDocument(document: any, bookingId: string, collection: string) {
    if (!document.bookings) document.bookings = [];
    const updatedBookingsOnDocument = [...document.bookings, new ObjectId(bookingId)];
    const db = await connectDB();
    const result = await db.collection(collection).updateOne(
        { _id: new ObjectId(document._id.toString()) },
        { $set: { bookings: updatedBookingsOnDocument } }
    );
}

export function validateBookCarInputdata(carId: string, driverId: string, sDate: string, daysNo: number) {
    if (!carId || !driverId || !sDate || !daysNo) {
        return { message: 'Missing required fields.' };
    }

    if (new Date(sDate) < new Date(new Date().setDate(new Date().getDate() - 1))) {
        return { message: 'Invalid date.' };
    }

    if (daysNo < 1) {
        return { message: 'Invalid days number.' };
    }
}
