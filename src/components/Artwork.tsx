import { useState } from 'react';
export function Artwork({src}:{src:string|null}) {
  const [failed,setFailed]=useState<string|null>(null);
  return src&&failed!==src?<img src={src} alt="" loading="lazy" onError={()=>setFailed(src)}/>:<span className="art-fallback" aria-hidden="true">◆</span>;
}
