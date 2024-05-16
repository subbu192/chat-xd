import Link from "next/link";

export default function Footer() {

    return (
        <div className="flex flex-row justify-start items-center gap-2 px-10 py-1 text-sm border-t-[1px] border-black">
            <p> &copy; chatXD</p>
            <p>-</p>
            <Link href={'#'}>Subramanyam Manchala</Link>
        </div>
    )
}