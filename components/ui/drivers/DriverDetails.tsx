import Image from "next/image";
import { User } from "@/lib/definitions";
import { Button } from "../button";
import { X } from "lucide-react";
import { redirect } from "next/navigation";

export default function CarDetails({ driver }: { driver: User }) {
    const handleClose = () => {
        redirect("/drivers");
    };

    return (
        <div className="flex flex-col bg-zinc-800 text-zinc-50 w-full md:w-8/12 rounded-lg border border-red-600 mt-4 items-center lg:items-stretch">
            <div>
                <Image
                    src={
                        driver.pictureUrl ||
                        "/public/drivers/nc_default_user.png"
                    }
                    alt={driver!.name || "Driver picture"}
                    width={900}
                    height={600}
                    quality={100}
                    className="mx-auto mt-8 overflow-hidden"
                />
            </div>
            <h1 className="mb-4 mt-4 text-red-600 font-semibold text-2xl lg:font-bold lg:text-3xl text-center">
                <em>{driver!.name}</em>
            </h1>

            <div className="flex flex-col md:flex-row justify-evenly align-top items-start text-left gap-4 p-4 lg:p-8">
                <div>
                    <h4 className="text-left font-bold pb-2">Driver details</h4>
                    <p>DOB: {driver!.dob ? new Date(driver!.dob).getFullYear() : "N/A"}</p>
                    <p>
                        Driving since:
                        {driver!.drivingSince ? new Date(driver!.drivingSince).getFullYear() : "N/A"}
                    </p>
                </div>
                <div className="flex flex-col text-left">
                    <h4 className="text-left font-bold pb-2">Contact</h4>
                    <p>Email: {driver!.email}</p>
                    <p>Phone: {driver!.phone}</p>
                    <p>Address: {driver!.address}</p>
                </div>
            </div>
            <div className="w-full flex flex-row justify-end p-4">
                <Button variant="destructive" size="icon" onClick={handleClose}>
                    <X />
                </Button>
            </div>
        </div>
    );
}
