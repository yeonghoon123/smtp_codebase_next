/*
작성자: 김영훈
코드 목적: 사용자가 원하는 메일 선택지 버튼
작성일: 2023.07.27
버젼: V0.1
*/

"use client";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
    return (
        <main className={styles.container}>
            <h1>Select SMTP type</h1>
            <div className={styles.btn_container}>
                <Link href="/basic-email">
                    <button>basic email</button>
                </Link>
                <Link href="/multiple-email">
                    <button>multiple email</button>
                </Link>
            </div>
        </main>
    );
}
