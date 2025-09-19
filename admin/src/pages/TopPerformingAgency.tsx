import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { getNewUsers, getTopAgencies, getTopPerformingHost } from "@/store/dashboardSlice";
import { RootStore } from "@/store/store"
import { baseURL } from "@/utils/config";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import male from "@/assets/images/male.png"
import { getDefaultCurrency } from "@/store/settingSlice";
import DashboardTable from "@/extra/DashboardTable";
import Image from "next/image";
import { getCountryCodeFromEmoji } from "@/utils/Common";
import india from "@/assets/images/india.png"


 const TopPerformingAgency = (props: any) => {
    const { startDate, endDate } = props;
    const dispatch = useDispatch();
    const { topAgencies } = useSelector((state: RootStore) => state.dashboard)
    const {defaultCurrency} = useSelector((state : RootStore) => state.setting)

     

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
                Header: "Agency",
                body: "profilePic",
                Cell: ({ row }: { row: any }) => {
                    const rawImagePath = row?.image || "";
                    const normalizedImagePath = rawImagePath.replace(/\\/g, "/");
            
                    const imageUrl = normalizedImagePath.includes("storage")
                    ? baseURL + normalizedImagePath
                    : normalizedImagePath;
                    
                    return (
                        <div style={{ cursor: "pointer" }}>
                            <div className="d-flex justify-content-center px-2 py-1">
                                <div>
                                    <img
                                        src={row?.image ? imageUrl : male}
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
                                    <p className="text-capitalize fw-semibold">{row?.agencyCode || 0}</p>
                                </div>
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
                                    src={ row?.countryFlagImage ? row?.countryFlagImage : india.src}
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
                Header: `Total Earning (${defaultCurrency?.symbol})`,
                Cell: ({ row }: { row: any }) => (
                    <span className="text-capitalize fw-semibold">{row?.totalEarnings || "-"}</span>
                ),
            },

            {
                Header: "Commission (%)",
                Cell: ({ row }: { row: any }) => (
                    <span className="text-capitalize fw-semibold">{row?.commission?.toFixed(2) || 0}</span>
                ),
            },

            {
                Header: "No Of Host",
                Cell: ({ row }: { row: any }) => (
                    <span className="text-capitalize fw-semibold">{row?.hostsCount || 0}</span>
                ),
            },


    
            {
                Header: "Date",
                Cell: ({ row }: { row: any }) => (
                    <span className="text-capitalize fw-semibold text-nowrap">{row?.createdAt?.split("T")[0] || "-"}</span>
                ),
            },
            
    
           
        ];
    

    useEffect(() => {

        const payload = {
            startDate,
            endDate
        }

        dispatch(getTopAgencies(payload))
    }, [dispatch , startDate , endDate])

    

    return (
        <div className="mt-4">
        <DashboardTable
         title={"Top Performing Agency"}
            data={topAgencies}
            mapData={pendingHostRequest}
        />
       
    </div>
    )
}

export default TopPerformingAgency