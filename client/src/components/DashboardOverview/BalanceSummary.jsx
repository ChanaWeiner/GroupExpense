import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import sendRequest from "../../services/serverApi";

export default function BalanceSummary({balance,isLoading}) {
    return (
        <section className="balance-summary">
            {isLoading ? (
                <p>Loading balance...</p>
            ) : (
                <>
                    <div className="balance-box positive">Total Credit: {balance.totalCredit}₪</div>
                    <div className="balance-box neutral">You are owed: {balance.owedToYou}₪</div>
                    <div className="balance-box negative">You owe: {balance.youOwe}₪</div>
                </>
            )}
        </section>
    );
}
