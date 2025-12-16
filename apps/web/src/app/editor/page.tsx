'use client'
import EditorClient from "@/components/common/Editor";
import { useState } from "react";


export default function EditorPage() {
     const [content, setContent] = useState('');
  return (
    <>
    <EditorClient content={content} onChange={setContent} />
    </>
  );
}