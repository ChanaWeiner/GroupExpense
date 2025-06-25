import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import sendRequest from "../../services/serverApi";

export default function BalanceSummary({ balance, isLoading }) {
    return (
        <section className="balance-summary" dir="rtl">
            {isLoading ? (
                <p>טוען את היתרה...</p>
            ) : (
                <>
                    <div className="balance-box positive">יתרה כוללת: {balance.totalCredit}₪</div>
                    <div className="balance-box neutral">חייבים לך: {balance.owedToYou}₪</div>
                    <div className="balance-box negative">את/ה חייב/ת: {balance.youOwe}₪</div>
                </>
            )}
        </section>
    );
}
