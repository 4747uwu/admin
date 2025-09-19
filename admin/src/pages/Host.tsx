import { FakeHost } from "@/component/host/FakeHost";
import { RealHost } from "@/component/host/RealHost";
import RootLayout from "@/component/layout/Layout";
import { routerChange } from "@/utils/Common";
import { hostTypes, userTypes } from "@/utils/extra";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Host = () => {

    const [type, setType] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedType = localStorage.getItem("hostTypeData") || "real_host";
        if (storedType) setType(storedType);
    }, []);


    useEffect(() => {
        if (type) {
            localStorage.setItem("hostTypeData", type);
        }
    }, [type]);

    useEffect(() => {
        routerChange("/Host", "hostTypeData", router)
    }, []);


    return (
        <>
            <div className="my-2 host_width mt-2">
                {hostTypes.map((item, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`${type === item.value ? "activeBtn" : "disabledBtn"} ${index !== 0 ? "ms-1" : ""}`}
                        onClick={() => setType(item.value)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {
                type === "real_host" && (
                    <RealHost type={type} />
                )
            }

            {
                type === "fake_host" && (
                    <FakeHost type={type} />
                )
            }





        </>

    )
}

Host.getLayout = function getLayout(page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};

export default Host;
