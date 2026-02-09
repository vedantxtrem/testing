import Link from "next/link";


export default function Home() {
return (
<div style={{ padding: 30 }}>
<h1>Product CRUD App</h1>
<Link href="/products">Go to Products</Link>
</div>
);
}