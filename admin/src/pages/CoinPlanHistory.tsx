import RootLayout from "@/component/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@/store/store";
import Table from "@/extra/Table";
import Pagination from "@/extra/Pagination";
import { useEffect, useState } from "react";
import Analytics from "@/extra/Analytic";
import { getCoinPlanUserHistory } from "@/store/coinPlanSlice";
import { getCoinPlanHistory } from "@/store/hostSlice";


const CoinPlanHistory = (props: any) => {
    const { queryType } = props;
    const dispatch = useDispatch();
    const { dialogue, dialogueType } = useSelector(
        (state: RootStore) => state.dialogue
    );
    const userData = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userData") || "null") : null;
    const hostData = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("hostData") || "null") : null;

    const { coinPlanHistory, totalCoinPlanHistory, totalIncoming, totalOutGoing } = useSelector((state: RootStore) => state.coinPlan)

    const { hostCoinHistory, totalHostCoinPlanHistory } = useSelector((state: RootStore) => state.host)
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [startDate, setStartDate] = useState("All");
    const [endDate, setEndDate] = useState("All");
    const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
    const toggleReview = (index: number) => {
        setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const coinPlanHistoryData =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("coinPlanHistoryData") || "null")
            : null;

    useEffect(() => {
        const payload = {
            start: page,
            limit: rowsPerPage,
            id: queryType === "host" ? hostData?._id : userData?._id,
            startDate,
            endDate
        };

        if (queryType === "host") {
            dispatch(getCoinPlanHistory(payload))
        } else {

            dispatch(getCoinPlanUserHistory(payload))
        }

    }, [dispatch, page, rowsPerPage, startDate, endDate, queryType])

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event, 10));
        setPage(1);
    };


    const coinPlanTable = [
        {
            Header: "No",
            Cell: ({ index }: { index: any }) => (
                <span> {(page - 1) * rowsPerPage + parseInt(index) + 1}</span>
            ),
        },

        {
            Header: "UniqueId",
            body: "uniqueid",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize cursorPointer">
                    {row?.uniqueId}
                </span>
            ),
        },

        {
            Header: `${queryType === "host" ? "Sender Name" : "Receiver Name"} `,
            body: "uniqueid",
            Cell: ({ row }: { row: any }) => (
                <div className="d-flex justify-content-center align-items-center gap-2">

                    <span className="text-capitalize cursorPointer">
                        {queryType === "host" ? row?.senderName || "-" : row?.receiverName || "-"}
                    </span>

                </div>
            ),
        },

        {
            Header: "Description",
            Cell: ({ row }: { row: any }) => (
                <div className="d-flex justify-content-center align-items-center">
                    <div style={{ width: "150px", textAlign: "left" }}>
                        <span className="text-capitalize">{row?.typeDescription}</span>
                    </div>
                    {row?.payoutStatus === 1 && (
                        <p style={{  color: "#FF8D0B" }}>(Pending)</p>
                    )}
                    {row?.payoutStatus === 2 && (
                        <p style={{  color: "#0EBA1A" }}>(Accepted)</p>
                    )}
                    {row?.payoutStatus === 3 && (
                        <p style={{  color: "#FF3737" }}>(Declined)</p>
                    )}
                </div>
            ),

        },
        queryType === "host"
            ? {
                Header: "User Coin",
                Cell: ({ row }: { row: any }) => (
                    <span
                        className="text-capitalize"
                        style={{ color: "red" }}
                    >
                        {`  - ${row?.userCoin.toFixed(2)}` || 0}
                    </span>
                ),
            }
            : {
                Header: "User Coin",
                Cell: ({ row }: { row: any }) => (
                    <span
                        className="text-capitalize"
                        style={{ color: row?.isIncome ? "green" : "red" }}
                    >
                        {`${row?.isIncome ? "+" : "-"}  ${row?.userCoin?.toFixed(2)}` || 0}
                    </span>
                ),
            },


        queryType === "host" ?
            {
                Header: "Host Coin",
                Cell: ({ row }: { row: any }) => {
                    const hostCoin = row?.hostCoin ?? 0;
                    const isIncome = row?.isIncome
                    const isPositive = hostCoin > 0;
                    return (
                        <span
                            className="text-capitalize"
                            style={{
                                color: isIncome === true ? "green" : row?.payoutStatus === 2 ? "red" : "orange",
                            }}
                        >
                            {isIncome === true ? `+${hostCoin.toFixed(2)}` : row?.payoutStatus === 2 ? `-${hostCoin.toFixed(2)}` : hostCoin.toFixed(2)}
                        </span>
                    );
                },
            }
            :

            {
                Header: "Host Coin",
                Cell: ({ row }: { row: any }) => {
                    const hostCoin = row?.hostCoin ?? 0;
                    const isPositive = hostCoin > 0;
                    return (
                        <span
                            className="text-capitalize"
                            style={{
                                color: isPositive ? "green" : "inherit",
                            }}
                        >
                            {isPositive ? `+${hostCoin.toFixed(2)}` : hostCoin.toFixed(2)}
                        </span>
                    );
                },
            },


        {
            Header: "Admin Coin",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize">{row?.adminCoin?.toFixed(2) || 0}</span>
            ),
        },


        {
            Header: "Agency Coin",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize">{row?.agencyCoin?.toFixed(2) || 0}</span>
            ),
        },




        {
            Header: "Date",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize">{row?.createdAt?.split("T")[0]}</span>
            ),
        },

    ];

    return (
        <>
            <div className="row d-flex align-items-center pt-3">
                <div className="col-12 col-lg-6 col-md-6 col-sm-12 fs-20 fw-600 d-flex gap-2"
                    style={{ color: "#404040" }}
                >
                    {queryType !== "host" && (
                        <>
                            <div>
                                Total Income: <span style={{ color: "green" }}>{totalIncoming}</span>
                            </div>
                            <div>
                                Total Outgoing: <span style={{ color: "red" }}>{totalOutGoing}</span>
                            </div>
                        </>
                    )}



                </div>

                <div className="col-md-6 col-6 mb-0 d-flex justify-content-end">

                    <Analytics
                        analyticsStartDate={startDate}
                        analyticsStartEnd={endDate}
                        analyticsStartDateSet={setStartDate}
                        analyticsStartEndSet={setEndDate}
                        direction={"end"}
                    />
                </div>

            </div>

            <div className="mt-2">
                <Table
                    data={queryType === "host" ? hostCoinHistory : coinPlanHistory}
                    mapData={coinPlanTable}
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
                    totalData={queryType === "host" ? totalHostCoinPlanHistory : totalCoinPlanHistory}
                />
            </div>
        </>
    )
}

CoinPlanHistory.getLayout = function getLayout(page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
export default CoinPlanHistory;