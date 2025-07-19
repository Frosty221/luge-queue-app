export function Card({ children }) {
  return <div className="border rounded-2xl shadow p-2 bg-white">{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={"p-4 " + (className || "")}>{children}</div>;
}