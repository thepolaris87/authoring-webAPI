import React from 'react';

export default function View({ viewRef }: { viewRef: React.RefObject<HTMLDivElement> }) {
    return <div ref={viewRef} className="w-[800px] h-[500px] border rounded"></div>;
}
