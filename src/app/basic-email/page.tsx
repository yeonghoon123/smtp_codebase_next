/*
작성자: 김영훈
코드 목적: 메일에 내용과 첨부파일을 서버에 보내는 역할
작성일: 2023.07.27
버젼: V0.1
*/

"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// email input type 설정
type emailInput = {
    receiver: string;
    title: string;
    content: string;
};

export default function BasicEmail() {
    const [attachFile, setAttachFile] = useState<any>(); // 사용자가 첨부한 파일 데이터

    // form에 편리성을 위한 useForm 사용
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<emailInput>();

    // 첨부한 파일을 변수에 저장
    const readUserFile = (event: any) => {
        const fileList = event.target.files[0]; // 사용자가 첨부한 파일
        const reader = new FileReader(); // 파일에 데이터를 읽기 위한 생성자입니다

        // 파일의 정보를 읽고 그 값을 변수에 저장
        reader.onload = (event: any) => {
            setAttachFile({
                fileName: fileList.name,
                fileData: event.target.result,
            });
        };

        reader.readAsDataURL(fileList); // 파일을 읽은후 base64로 변환하는 함수
    };

    // 입력 조건들이 모두 만족하였을때 실행되는 함수
    const onSubmit: SubmitHandler<emailInput> = async (emailData: object) => {
        // 서버에 이메일 내용, 파일 데이터 전송
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_MULTI_API_ADDRESS}`,
            {
                method: "POST",
                body: JSON.stringify({ emailData, attachFile }),
            }
        );

        response.ok ? alert("메일 전송 완료") : alert("메일 전송 오류 발생"); // 전송 완료 확인
    };

    return (
        <main className={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.smtp_container}>
                    <div className={styles.smtp_header_container}>
                        <h1>Soy-smtp</h1>
                    </div>
                    <div className={styles.smtp_contant_container}>
                        <div className={styles.smtp_contant}>
                            <span>수신자</span>
                            <input
                                type="text"
                                className={styles.smtp_contant_input}
                                {...register("receiver", {
                                    required: "This input is required.",
                                    pattern: {
                                        value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/i,
                                        message: "This input is email only",
                                    },
                                })}
                            />
                            <p>{errors.receiver?.message}</p>
                        </div>
                        <div className={styles.smtp_contant}>
                            <span>제목</span>
                            <input
                                type="text"
                                className={styles.smtp_contant_input}
                                {...register("title", {
                                    required: "This field is required",
                                })}
                            />
                            <p>{errors.title?.message}</p>
                        </div>
                        <div className={styles.smtp_contant_body}>
                            <span>내용</span>
                            <p>{errors.content?.message}</p>
                            <textarea
                                style={{ width: "780px" }}
                                placeholder={errors.content?.message}
                                {...register("content", {
                                    required: "This field is required",
                                })}
                            ></textarea>
                        </div>
                        <div className={styles.smtp_contant}>
                            <span>첨부파일</span>
                            <input
                                type="file"
                                className={styles.smtp_contant_input}
                                onChange={readUserFile}
                            />
                        </div>
                    </div>

                    <div className={styles.smtp_submit_container}>
                        <button className={styles.smtp_submit_btn}>
                            메일 전송
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
}
