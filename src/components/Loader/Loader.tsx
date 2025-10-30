import clsx from 'clsx'
import './Loader.css'

export default function Loader({ isLoading }: { isLoading: boolean }){
    return (
        <span className={clsx("loader", isLoading ? '' : 'opacity-0')}></span>
    )
}