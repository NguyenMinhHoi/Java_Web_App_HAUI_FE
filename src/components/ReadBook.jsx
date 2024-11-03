import React, { useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useParams } from 'react-router-dom';

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="bg-white border border-gray-200 flex flex-col justify-between h-full" ref={ref}>
      <div className="p-4 text-center bg-gray-100">Page {props.number}</div>
      <div className="flex-grow p-6 text-base leading-relaxed">{props.children}</div>
      <div className="p-4 text-center bg-gray-100">Page {props.number}</div>
    </div>
  );
});

export default function ReadBook() {
  const { id } = useParams();
  const [totalPage] = useState(10); // Giả sử sách có 10 trang

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Đọc sách (ID: {id})</h1>
      <div className="shadow-2xl">
        <HTMLFlipBook width={550} height={733} showCover={true}>
          <Page number="Cover">
            <div className="flex flex-col justify-center items-center h-full bg-[#faa21a] text-white">
              <h1 className="text-4xl font-bold mb-4">Tựa đề sách</h1>
              <p className="text-xl">Tác giả: Nguyễn Văn A</p>
            </div>
          </Page>
          {[...Array(totalPage)].map((_, index) => (
            <Page key={index} number={index + 1}>
              <div className="h-full flex items-center justify-center">
                Nội dung trang {index + 1}
              </div>
            </Page>
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
}