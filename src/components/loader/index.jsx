import styles from './styles.module.css'

export default function Loader({loading}) {
    
    return <div className={`${loading? 'block' : 'hidden'} w-screen h-screen absolute top-0 left-0`} >
            <div className='w-full h-full bg-black opacity-50'></div>
            <div className={styles.loader}></div>
        </div>
}