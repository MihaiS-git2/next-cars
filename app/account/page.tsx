"use client";

import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
    getFullUserByEmail,
    getUserByEmail,
} from "@/lib/queries/users-queries";
import { useActionState, useEffect, useState } from "react";
import { User } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { updateUser } from "@/app/actions/account/actions";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User>();
    const [userData, setUserData] = useState<User>({
        name: "",
        address: "",
        phone: "",
        email: "",
        role: "CUSTOMER",
        dob: "",
        drivingSince: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const email = session?.user?.email;

    useEffect(() => {
        if (status === "authenticated" && email) {
            const fetchUser = async () => {
                try {
                    const userData = await getFullUserByEmail(email);
                    const user = userData as User;

                    if (user) {
                        setUser(user);
                        setUserData({
                            email: user.email || email,
                            name: user.name || "",
                            address: user.address || "",
                            phone: user.phone || "",
                            role: user.role ? user.role : "CUSTOMER",
                            dob: user.dob || "",
                            drivingSince: user.drivingSince || "",
                            password: "",
                            pictureUrl: user.pictureUrl || "",
                        });
                    } else {
                        setUserData((prev) => ({
                            ...prev,
                            email: email,
                        }));
                    }
                } catch (err) {
                    setError("Error fetching user data");
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }
    }, [session, status, email]);

    const initialState = { message: "", errors: {} };
    const [formState, formAction] = useActionState(updateUser, initialState);

    const handleClose = () => {
        router.push("/");
    };

    if (status === "loading" || loading)
        return (
            <div className="flex items-center justify-center h-80">
                <p className="text-zinc-400 my-auto">
                    Loading account details...
                </p>
            </div>
        );

    if (status === "unauthenticated")
        return <p>You must be logged in to see this.</p>;

    if (error && error !== "User not found")
        return <p className="p-16 bg-slate-50 text-red-600">{error}</p>;

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col items-center w-full sm:w-11/12 md:w-10/12 mx-auto">
                <h3 className="my-8 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                    <em>Account details</em>
                </h3>
                <Image
                    src={user?.pictureUrl || "/customers/nc_default_user.png"}
                    alt="user image"
                    width={200}
                    height={200}
                    quality={80}
                />
                <p className="text-xl">
                    Hello {userData.name || session?.user?.name}!
                </p>
                <form
                    action={() => {
                        const formData = new FormData();
                        Object.entries(userData).forEach(([key, value]) => {
                            formData.append(key, value as string);
                        });
                        formData.append("email", email || "");
                        formAction(formData);
                    }}
                    className="flex flex-col gap-4 justify-between align-middle w-full p-4 md:p-8"
                    noValidate
                >
                    <p className="flex flex-row justify-between align-middle mx-2">
                        <label
                            htmlFor="name"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Full Name:
                        </label>
                        <input
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                            id="name"
                            name="name"
                            type="text"
                            value={userData.name}
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                }))
                            }
                            aria-describedby="name-error"
                        />
                    </p>
                    <div
                        id="name-error"
                        className="text-center text-base text-red-600"
                    >
                        {formState.errors?.name &&
                            formState.errors?.name.map((error) => (
                                <p key={error}>{error}</p>
                            ))}
                    </div>
                    <p className="flex flex-row justify-between mx-2">
                        <label
                            htmlFor="address"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Address:
                        </label>
                        <input
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                            id="address"
                            name="address"
                            type="text"
                            value={userData.address}
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                }))
                            }
                            aria-describedby="address-error"
                        />
                    </p>
                    <div
                        id="address-error"
                        className="text-center text-base text-red-600"
                    >
                        {formState.errors?.address &&
                            formState.errors?.address.map((error) => (
                                <p key={error}>{error}</p>
                            ))}
                    </div>
                    <p className="flex flex-row justify-between mx-2">
                        <label
                            htmlFor="phone"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Phone:
                        </label>
                        <input
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                            id="phone"
                            name="phone"
                            type="text"
                            value={userData.phone}
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                }))
                            }
                            aria-describedby="phone-error"
                        />
                    </p>
                    <div
                        id="phone-error"
                        className="text-center text-base text-red-600"
                    >
                        {formState.errors?.phone &&
                            formState.errors?.phone.map((error) => (
                                <p key={error}>{error}</p>
                            ))}
                    </div>
                    <p className="flex flex-row justify-between mx-2">
                        <label
                            htmlFor="email"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            E-mail:
                        </label>
                        <input
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                            id="email"
                            name="email"
                            type="email"
                            value={userData.email || email || ""}
                            readOnly
                        />
                    </p>
                    <p className="flex flex-row justify-between mx-2 my-4">
                        <label
                            htmlFor="role"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Role:
                        </label>
                        <select
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                            name="role"
                            id="role"
                            value={user?.role || "CUSTOMER"}
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                }))
                            }
                            disabled={user?.role === "CUSTOMER"}
                        >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="DRIVER">DRIVER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </p>
                    <p className="flex flex-row justify-between mx-2">
                        <label
                            htmlFor="dob"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Date of birth:
                        </label>
                        <input
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                            id="dob"
                            name="dob"
                            type="date"
                            value={
                                userData.dob
                                    ? new Date(userData.dob)
                                          .toISOString()
                                          .split("T")[0]
                                    : ""
                            }
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                }))
                            }
                            aria-describedby="dob-error"
                        />
                    </p>
                    <div
                        id="dob-error"
                        className="text-center text-base text-red-600"
                    >
                        {formState.errors?.dob &&
                            formState.errors?.dob.map((error) => (
                                <p key={error}>{error}</p>
                            ))}
                    </div>
                    <p className="flex flex-row justify-between mx-2">
                        <label
                            htmlFor="drivingSince"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Driving since:{" "}
                        </label>
                        <input
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                            id="drivingSince"
                            name="drivingSince"
                            type="date"
                            value={
                                userData.drivingSince
                                    ? new Date(userData.drivingSince)
                                          .toISOString()
                                          .split("T")[0]
                                    : ""
                            }
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                }))
                            }
                            aria-describedby="drivingSince-error"
                        />
                    </p>
                    <div
                        id="drivingSince-error"
                        className="text-center text-base text-red-600"
                    >
                        {formState.errors?.drivingSince &&
                            formState.errors?.drivingSince.map((error) => (
                                <p key={error}>{error}</p>
                            ))}
                    </div>
                    <Button
                        type="submit"
                        className="bg-zinc-200 text-zinc-950 mt-4 hover:text-zinc-50 hover:bg-zinc-700 w-1/3 mx-auto"
                    >
                        Update
                    </Button>
                </form>
                <div
                    id="general-error"
                    className="text-center text-base text-red-600 pb-4"
                >
                    {formState.message && <p>{formState.message}</p>}
                </div>
            </div>
            <div className="w-full flex flex-row justify-end pb-4 pe-4">
                <Button variant="destructive" size="icon" onClick={handleClose}>
                    <X />
                </Button>
            </div>
        </div>
    );
}
