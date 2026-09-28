"use client";
import Image from "next/image";
import fbImage from '../../assets/Frame.png';
import iImage from '../../assets/Vector.png';
import xImage from '../../assets/Frame(1).png';

export default function Footer() {
  return (
    <footer className="flex justify-center gap-6 border-t border-[#2e2e30] bg-surface px-6 py-6">
      <div className="flex gap-6">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <Image src={fbImage} alt="Facebook" width={24} height={24} />
        </a>
        <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
          <Image src={xImage} alt="X (Twitter)" width={24} height={24} />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <Image src={iImage} alt="Instagram" width={24} height={24} />
        </a>
      </div>
    </footer>
  );
}