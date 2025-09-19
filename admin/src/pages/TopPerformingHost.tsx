import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { getNewUsers, getTopPerformingHost } from "@/store/dashboardSlice";
import { RootStore } from "@/store/store"
import { baseURL } from "@/utils/config";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import male from "@/assets/images/male.png"
import { getDefaultCurrency } from "@/store/settingSlice";
import DashboardTable from "@/extra/DashboardTable";
import Image from "next/image";
import { useRouter } from "next/router";
import { getCountryCodeFromEmoji } from "@/utils/Common";
import india from "@/assets/images/india.png"


const TopPerformingHost = (props: any) => {
    const { startDate, endDate, type } = props;
    const dispatch = useDispatch();
    const { topPerformingHost } = useSelector((state: RootStore) => state.dashboard)
    const { defaultCurrency } = useSelector((state: RootStore) => state.setting)
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const router = useRouter();


    useEffect(() => {
        if (startDate && endDate) {

            const payload = {
                startDate,
                endDate
            }
            dispatch(getTopPerformingHost(payload))

        }
    }, [dispatch, startDate, endDate])

    useEffect(() => {
        dispatch(getDefaultCurrency())
    }, [])


    const pendingHostRequest = [
        {
            Header: "No",
            Cell: ({ index }: { index: any }) => (
                <span> {index + 1}</span>
            ),
        },

        {
            Header: "Host",
            body: "profilePic",
            Cell: ({ row }: { row: any }) => {
                const rawImagePath = row?.image || "";
                const normalizedImagePath = rawImagePath.replace(/\\/g, "/");

                const imageUrl = normalizedImagePath.includes("storage")
                    ? baseURL + normalizedImagePath
                    : normalizedImagePath;

                const handleClick = () => {
                    router.push({
                        pathname: "/Host/HostInfoPage",
                        query: { id: row?._id },
                    });
                }

                return (
                    <div style={{ cursor: "pointer" }}
                        onClick={handleClick}
                    >
                        <div className="d-flex px-2 py-1">
                            <div>
                                <img
                                    src={row?.image ? imageUrl : male.src}
                                    alt="Image"
                                    loading="eager"
                                    draggable="false"
                                    style={{
                                        borderRadius: "10px",
                                        objectFit: "cover",
                                        height: "50px",
                                        width: "50px",
                                    }}
                                    height={70}
                                    width={70}
                                />
                            </div>
                            <div className="d-flex flex-column justify-content-center text-start ms-3">
                                <p className="mb-0 text-sm text-capitalize fw-semibold">{row?.name || "-"}</p>
                                <p className="mb-0 text-sm text-capitalize fw-semibold">{row?.uniqueId || "-"}</p>
                            </div>
                        </div>
                    </div>
                );
            },
        },


        {
            Header: "Agency",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-semibold">{row?.agencyName || "-"}</span>
            ),
        },


        {
            Header: "Country",
            Cell: ({ row }: { row: any }) => {
                const countryName = row?.country || "-";
                const emoji = row?.countryFlagImage; // e.g., "🇮🇳"

                const countryCode = getCountryCodeFromEmoji(emoji); // "in"

                const flagImageUrl = countryCode
                    ? `https://flagcdn.com/w80/${countryCode}.png`
                    : null;

                return (
                    <div className="d-flex justify-content-end align-items-center gap-3">
                        {flagImageUrl && (
                            <div style={{ width: "70px", textAlign: "end" }}>
                                <img
                                    src={flagImageUrl ? flagImageUrl : india.src}
                                    height={30}
                                    width={40}
                                    alt={`${countryName} Flag`}
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                    }}
                                />
                            </div>
                        )}
                        <div style={{ width: "200px", textAlign: "start" }}>
                            <span className="text-capitalize fw-semibold" style={{ marginLeft: "10px" }}>
                                {countryName}
                            </span>
                        </div>
                    </div>
                );
            },
        },


        {
            Header: `Coin `,
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-semibold">{row?.coin?.toFixed(2) || "-"}</span>
            ),
        },

        {
            Header: "Is Online",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-semibold">{row?.isOnline ? "Yes" : "No"}</span>
            ),
        },

        {
            Header: "Date",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-semibold text-nowrap">{row?.createdAt?.split("T")[0] || "-"}</span>
            ),
        },
    ];

    return (
        <div className="mt-4">
            <DashboardTable
                title={"Top Performing Host"}
                data={topPerformingHost}
                mapData={pendingHostRequest}

            />

        </div>
    )
}

export default TopPerformingHost