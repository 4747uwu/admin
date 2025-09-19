import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { openDialog } from "@/store/dialogSlice";
import { RootStore } from "@/store/store";
import {  warning, warningForAccept } from "@/utils/Alert";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import info from "@/assets/images/info.svg";
import { baseURL } from "@/utils/config";
import male from "@/assets/images/male.png"
import ToggleSwitch from "@/extra/TogggleSwitch";
import RootLayout from "@/component/layout/Layout";
import Analytics from "@/extra/Analytic";
import Searching from "@/extra/Searching";
import historyInfo from "@/assets/images/history1.png"
import { blockonlinebusyHost, blockRealHost, blockUnblockHost, getRealOrFakeHost } from "@/store/hostSlice";
import notification from "@/assets/images/notification1.svg";
import Image from "next/image";
import { getCountryCodeFromEmoji } from "@/utils/Common";
import india from "@/assets/images/india.png"

interface SuggestedServiceData {
    _id: string;
    doctor: string;
    name: string;
    gender: string;
    email: string;
    age: number;
    dob: any
    description: string;
    country: string;
    impression: string
}

export const RealHost = (props: any) => {
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState("All");
    const [endDate, setEndDate] = useState("All");
    const router = useRouter();
   
    const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

    const toggleReview = (index: number) => {
        setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const { dialogue, dialogueType } = useSelector(
        (state: RootStore) => state.dialogue
    );
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const { host, total } = useSelector((state: RootStore) => state.host)
    const [data, setData] = useState<any[]>([]);
    const [search, setSearch] = useState("");


    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    useEffect(() => {
        const payload = {
            start: page,
            limit: rowsPerPage,
            startDate,
            endDate,
            search,
            type: 1
        }
        dispatch(getRealOrFakeHost(payload))
    }, [page, rowsPerPage, startDate, endDate, search])


    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event, 10));
        setPage(1);
    };

    const handleFilterData = (filteredData: any) => {

        if (typeof filteredData === 'string') {
            setSearch(filteredData);
        } else {
            setData(filteredData);
        }
    };



    const handleInfo = (row: any) => {

        router.push({
            pathname: "/Host/HostInfoPage",
            query: { id: row?._id },
        });

        
        
        typeof window !== "undefined" && localStorage.setItem("hostData", JSON.stringify(row))
    };

    const handleRedirect = (row: any) => {
        router.push({
            pathname: "/Host/HostHistoryPage",
            query: { id: row?._id, type: "host" },
        });

        typeof window !== "undefined" && localStorage.setItem("hostData", JSON.stringify(row))

    }

    const handleNotify = (id: any) => {
        dispatch(
            openDialog({ type: "notification", data: { id, type: "host" } })
        );
    };


    const userTable = [
        {
            Header: "No",
            cellStyle: { paddingLeft: "10px !important" },
            Cell: ({ index }: { index: any }) => (
                <p> {(page - 1) * rowsPerPage + parseInt(index) + 1}</p>
            ),
        },
        {
            Header: "Agency",
            Cell: ({ row }: { row: any }) => {
                const updatedImagePath = row?.agencyId?.image ? row.agencyId?.image.replace(/\\/g, "/") : "";
                return (
                    <div className="d-flex justify-content-end align-items-center">
                        <div style={{ width: "100px", textAlign: "center" }}>
                            <img
                                src={row?.agencyId?.image ? baseURL + updatedImagePath : male.src}
                                alt="Image"
                                width="60"
                                height="60"
                                style={{ borderRadius: "10px", objectFit: "cover" }} // Styling for better appearance
                            />
                        </div>
                        <div style={{ width: "200px", textAlign: "start" }}>
                            <p className="text-capitalize text-nowrap font-normal">{row?.agencyId?.name ? row?.agencyId?.name : row?.agency?.name || "-"}</p>
                            <p className="text-capitalize cursorPointer text-nowrap">
                                {row?.agencyId?.agencyCode || "-"}
                            </p>
                        </div>

                    </div>
                )
            },
        },

        {
            Header: "Host",
            body: "profilePic",
            Cell: ({ row }: { row: any }) => {
                const updatedImagePath = row?.image ? row.image.replace(/\\/g, "/") : "";

                const handleClick = () => {
                    router.push({
                        pathname: "/Host/HostInfoPage",
                        query: { id: row?._id },
                    });
                }
                return (
                    <div style={{ cursor: "pointer" }} onClick={handleClick}>
                        <div className="d-flex px-2 py-1">
                            <div>
                                <img
                                    src={row?.image ? baseURL + updatedImagePath : male.src}
                                    alt="Image"
                                    loading="eager"
                                    draggable="false"
                                    style={{ borderRadius: "10px", objectFit: "cover", height: "50px", width: "50px" }}
                                    height={70}
                                    width={70}
                                />
                            </div>
                            <div className="d-flex flex-column justify-content-center text-start ms-3 text-nowrap">
                                <p className="mb-0 text-sm text-capitalize">{row?.name || "-"}</p>

                                <p className="mb-0 text-sm text-capitalize">{row?.uniqueId || "-"}</p>
                            </div>
                        </div>
                    </div>
                );
            },
        },

        {
            Header: "User",
            accessor: "User",
            Cell: ({ row }: { row: any }) => {
                // Define updatedImagePath before returning JSX
                const updatedImagePath = row?.userId?.image ? row.userId?.image.replace(/\\/g, "/") : "";

                const handleClick = () => {
                    router.push({
                        pathname: "/User/UserInfoPage",
                        query: { id: row?.userId?._id },
                    });
                }
                return (
                    <div className="d-flex justify-content-end align-items-center cursor-pointer"
                        onClick={handleClick}
                    >
                        {/* Image Section */}
                        <div style={{ width: "100px", textAlign: "center" }}>
                            <img
                                src={row?.userId?.image ? updatedImagePath : male.src}
                                alt="Image"
                                width="60"
                                height="60"
                                style={{ borderRadius: "10px", objectFit: "cover" }} // Styling for better appearance
                            />
                        </div>

                        {/* Product Name */}
                        <div style={{ width: "200px", textAlign: "start" }}>
                            <p className="text-capitalize ms-3 cursorPointer text-nowrap">
                                {row?.userId?.name || "-"}
                            </p>
                            <p className="text-capitalize ms-3 cursorPointer text-nowrap">
                                {row?.userId?.uniqueId || "-"}
                            </p>
                        </div>
                    </div>
                );
            },
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
                        <div style={{ width: "100px", textAlign: "start" }}>
                            <span className="text-capitalize text-nowrap">
                                {countryName}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            Header: "Followers",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-normal">{row?.totalFollowers || 0}</span>
            ),
        },


        {
            Header: "Gender",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-normal">{row?.gender || "-"}</span>
            ),
        },

        {
            Header: "Identity Proof Type",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-normal">{row?.identityProofType || "-"}</span>
            ),
        },


        {
            Header: "Impression",
            Cell: ({ row, index }: { row: SuggestedServiceData, index: any }) => {
                const isExpanded = expanded[index] || false;
                const impressionText = String(row?.impression || ""); // Convert to string
                const previewText = impressionText.substring(0, 15); // First 30 chars

                return (
                    <div className="text-capitalize fw-normal padding-left-2px"
                        style={{ width: "350px" }}
                    >
                        {isExpanded ? impressionText : previewText || "-"}
                        {impressionText.length > 10 && (
                            <span
                                onClick={() => toggleReview(index)}
                                className="text-primary bg-none"
                                style={{ cursor: "pointer", marginLeft: "5px" }}
                            >
                                {isExpanded && impressionText.length > 10 ? " Read less" : " Read more..."}
                            </span>
                        )}
                    </div>
                );

            },
        },

        {
            Header: "Coin",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-normal">{row?.coin?.toFixed(2)}</span>
            ),
        },

        {
            Header: "IsOnline",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-normal">{row?.isOnline === true ? "Yes" : "No"}</span>
            ),
        },

        {
            Header: "IsBusy",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-normal">{row?.isBusy === true ? "Yes" : "No"}</span>
            ),
        },


        {
            Header: "IsLive",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-normal">{row?.isLive === true ? "Yes" : "No"}</span>
            ),
        },

        {
            Header: "Created At",
            Cell: ({ row }: { row: any }) => {
                const date = new Date(row?.createdAt);
                const formattedDate = isNaN(date.getTime())
                    ? "-"
                    : date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    });
                return <span className="text-nowrap text-normal">{formattedDate}</span>;
            },
        },


        {
            Header: "IsBlock",
            body: "isBlock",
            Cell: ({ row }: { row: any }) => (
                <ToggleSwitch
                    value={row?.isBlock}
                    onClick={() => {
                        const id: any = row?._id;
                        const payload = {
                            hostId: id,
                            type: "isBlock"
                        }
                        dispatch(blockRealHost(payload));
                    }}
                />
            ),
        },



        {
            Header: "Info",
            Cell: ({ row }: { row: SuggestedServiceData }) => {


                return (
                    <div className="">
                        <button
                            style={{ backgroundColor: "#E1F8FF", borderRadius: "10px", padding: "8px" }}
                            onClick={() => handleInfo(row)}
                        >
                            <img
                                src={info.src}
                                height={22}
                                width={22}
                                alt="Info-Image"
                                style={{ height: "22px", width: "22px", objectFit: "contain" }}
                            />
                        </button>
                    </div>
                )

            },
        },

        {
            Header: "Noification",
            body: "",
            Cell: ({ row }: { row: any }) => (
                <button
                    className="text-white"
                    onClick={() => handleNotify(row?._id)}
                    style={{ borderRadius: "12px", padding: "8px", background: "#FFEFE1" }}
                >
                    <img
                        src={notification.src}
                        width={22}
                        height={22}
                        style={{ height: "22px", width: "22px", objectFit: "contain" }}
                    />

                </button>
            ),
        },


        {
            Header: "History",
            body: "",
            Cell: ({ row }: { row: any }) => (
                <>
                    <button
                        style={{ borderRadius: "10px", padding: "8px", background: "#FFE7E7" }}
                        onClick={() => handleRedirect(row)}
                    >

                        <img
                            src={historyInfo.src}
                            height={30}
                            width={30}
                            alt="History"
                            style={{ height: "24px", width: "24px", objectFit: "cover" }}
                        />
                    </button>


                </>

            ),
        },



    ];
    return (
        <div className="mainCategory">

            <div className="d-flex justify-content-between align-items-center">
                <Analytics
                    analyticsStartDate={startDate}
                    analyticsStartEnd={endDate}
                    analyticsStartDateSet={setStartDate}
                    analyticsStartEndSet={setEndDate}
                    direction={"start"}
                />
                <div className="col-6 mt-3">
                    <Searching
                        type={`server`}
                        data={host}
                        setData={setData}
                        column={userTable}
                        serverSearching={handleFilterData}
                        placeholder={"Search by Host Name/Unique ID"}
                    />
                </div>
            </div>

            <div className="mt-4">
                <Table
                    data={host}
                    mapData={userTable}
                    PerPage={rowsPerPage}
                    Page={page}
                    type={"server"}
                />
                <Pagination
                    type={"server"}
                    serverPage={page}
                    setServerPage={setPage}
                    serverPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    totalData={total}
                />
            </div>
        </div>
    )
}

