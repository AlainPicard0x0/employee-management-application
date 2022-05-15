

const MobileTimeSheet = () => {
    return (
        <>
            <div className="mobile-portal">
                <div className="mobile-header">
                    <div className="mobile-header-selection-container">
                        <div className="mobile-time-sheet active">Time Sheet</div>
                        <div className="mobile-vacation"><a href="./vacation">Vacation</a></div>
                        <div className="mobile-sick-leave"><a href="./sick-leave">Sick Leave</a></div>                       
                    </div>
                </div>
            </div>
            <div className="mobile-body">
                <div className="row-1-col-1">

                </div>
                <div className="row-2-col-1">

                </div>
            </div>
        </>
    )
}

export default MobileTimeSheet;