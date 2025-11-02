import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    (p, ref) => <input ref={ref} {...p} className={`border rounded px-3 py-2 w-full ${p.className||""}`} />
);
