/*
작성자: 김영훈
코드 목적: 메일에 내용과 첨부파일을 서버에 보내는 역할
작성일: 2023.07.31
버젼: V0.1
*/

"use client";
import styles from "./page.module.css";
import { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Chip } from "@mui/material";

// email input type 설정
type emailInput = {
    title: string;
    content: string;
};

export default function MultipleEmail() {
    const [attachFile, setAttachFile] = useState<any>([]); // 사용자가 첨부한 파일 데이터
    const [receiveEmail, setReceiveEmail] = useState<any>([]); // 사용자 다중 이메일 저장
    const receiveEmailRef = useRef<any>(null); // 이메일 주소 입력창 값 초기화를 위한 useRef훅 사용

    // M-0 폼데이터 활용을 위한 useForm 라이브러리 적용
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<emailInput>();

    // M-10 이메일 입력칸에 focus가 풀리면 데이터 저장
    const handleFocusOut = (event: React.FocusEvent<HTMLElement>) => {
        const { value } = event.target as HTMLButtonElement;

        if (value !== "") {
            const regex = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/g; // 이메일 정규식
            const regexCheck = regex.test(value); // 이메일 정규실 확인

            setReceiveEmail([
                ...receiveEmail,
                {
                    emailValue: value,
                    emailCheck: regexCheck,
                },
            ]);
        }

        receiveEmailRef.current.value = null;
    };

    // M-20 enter, space키 인식하여 데이터 저장
    const handleOnKeyPress = (event: React.KeyboardEvent) => {
        const { value } = event.target as HTMLButtonElement;
        if (value !== "") {
            if (event.code === "Enter" || event.code === "Space") {
                event.preventDefault();

                const regex = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/g; // 이메일 정규식
                const regexCheck = regex.test(value); // 이메일 정규실 확인

                setReceiveEmail([
                    ...receiveEmail,
                    {
                        emailValue: value,
                        emailCheck: regexCheck,
                    },
                ]);

                receiveEmailRef.current.value = null;
            }
        }
    };

    // M-30 첨부한 파일을 변수에 저장
    const readUserFile = (event: any) => {
        const fileList = event.target.files; // 사용자가 첨부한 파일 목록
        if (attachFile.length + fileList.length > 10) {
            alert("최대 10개까지 첨부 가능");
            return;
        }

        for (let cnt = 0; cnt < fileList.length; cnt++) {
            const reader = new FileReader(); // 파일에 데이터를 읽기 위한 생성자입니다
            const readFile = fileList[cnt]; // 읽을 파일 데이터

            // 파일의 정보를 읽고 그 값을 변수에 저장
            reader.onload = (event: any) => {
                setAttachFile((originData: any) => {
                    return [
                        ...originData,
                        {
                            filename: readFile.name,
                            path: event.target.result,
                        },
                    ];
                });
            };

            reader.readAsDataURL(readFile); // 파일을 읽은후 base64로 변환하는 함수
        }
    };

    // M-40 이메일 배열에서 선택한 이메일데이터 삭제
    const deleteReceiveEmailChip = (indexNum: number) => {
        const updatedItems = [...receiveEmail];
        updatedItems.splice(indexNum, 1);
        setReceiveEmail(updatedItems);
    };

    // M-50 첨부파일 배열에서 선택한 파일데이터 삭제
    const deleteAttachChip = (indexNum: number) => {
        const updatedItems = [...attachFile];
        updatedItems.splice(indexNum, 1);
        setAttachFile(updatedItems);
    };

    // M-60 사용자가 입력한 데이터, 파일데이터를 서버에 전송
    const onSubmit: SubmitHandler<emailInput> = async (emailData: object) => {
        // 이메일 정규식에 적합한 데이터만 배열로 변경
        const emailArray = receiveEmail.reduce(
            (acc: any, emailData: any, index: number) => {
                if (emailData.emailCheck) {
                    acc.push(emailData.emailValue);
                }
                return acc;
            },
            []
        );

        // 이메일 형식이 적합한 메일 목록에 아무것도 없을 경우 전송 취소
        if (emailArray.length === 0) {
            alert("받는 사람 메일을 적어주세요.");
            return;
        }

        const requestAPIURL: any = process.env.NEXT_PUBLIC_MULTI_API_ADDRESS; // API endpoint URL

        // lambda로 보낼 body데이터
        const bodyData = JSON.stringify({
            emailData: { ...emailData, receiver: emailArray },
            attachFile,
        });

        // 서버에 이메일 내용, 파일 데이터 전송
        const response = await fetch(requestAPIURL, {
            method: "POST",
            body: bodyData,
        });

        const tmpResponse = await response.json();
        console.log(tmpResponse);

        response.ok ? alert("메일 전송 완료") : alert("메일 전송 오류 발생"); // 전송 완료 확인
    };

    // M-70 사용자에게 보여질 JSX 코드
    return (
        <>
            <main className={styles.container}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.smtp_container}>
                        <div className={styles.smtp_header_container}>
                            <h1>Soy-smtp Multiple</h1>
                        </div>
                        <div className={styles.smtp_contant_container}>
                            <div className={styles.smtp_contant}>
                                <span className={styles.smtp_contant_title}>
                                    수신자
                                </span>
                                <div className={styles.smtp_receiver_mail}>
                                    {receiveEmail.map(
                                        (value: any, index: number) => {
                                            return (
                                                <div
                                                    className={
                                                        styles.smtp_receiver_chip
                                                    }
                                                    key={`receive_mail_${index}`}
                                                >
                                                    <Chip
                                                        label={value.emailValue}
                                                        onDelete={() => {
                                                            deleteReceiveEmailChip(
                                                                index
                                                            );
                                                        }}
                                                        color={
                                                            value.emailCheck
                                                                ? "primary"
                                                                : "error"
                                                        }
                                                        size="small"
                                                    />
                                                </div>
                                            );
                                        }
                                    )}
                                    <input
                                        type="text"
                                        className={styles.smtp_receiver_input}
                                        ref={receiveEmailRef}
                                        name="userEmail"
                                        onBlur={handleFocusOut}
                                        onKeyDown={handleOnKeyPress}
                                    />
                                </div>
                                {/* <p>{errors.receiver?.message}</p> */}
                            </div>
                            <div className={styles.smtp_contant}>
                                <span className={styles.smtp_contant_title}>
                                    제목
                                </span>
                                <input
                                    type="text"
                                    className={styles.smtp_title_input}
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
                            <div className={styles.smtp_attach_contant}>
                                <label
                                    htmlFor="input-file"
                                    className={styles.smtp_attach_label}
                                >
                                    파일 첨부({attachFile.length})
                                </label>

                                <input
                                    type="file"
                                    id="input-file"
                                    className={styles.smtp_attach_input}
                                    multiple
                                    onChange={readUserFile}
                                />
                                <div className={styles.smtp_attach_chip_box}>
                                    {attachFile.map(
                                        (value: any, index: number) => {
                                            return (
                                                <div
                                                    className={
                                                        styles.smtp_attach_chip
                                                    }
                                                    key={`attach_file${index}`}
                                                >
                                                    <Chip
                                                        label={value.filename}
                                                        onDelete={() => {
                                                            deleteAttachChip(
                                                                index
                                                            );
                                                        }}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
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
        </>
    );
}
