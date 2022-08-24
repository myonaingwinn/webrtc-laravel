import { Spin } from 'antd';
import { useState, forwardRef, useImperativeHandle, } from 'react';

const Loading = forwardRef((props, ref) => {

    const [isLoading, setIsLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        handleLoading() {
            console.log('thi is in loading...', isLoading);
            setIsLoading(!isLoading);
        },
    }));

    return (
        <>
            {isLoading && (
                <div className='loading'>
                    <div className='filter'>
                        <Spin size="large" />
                    </div>
                </div>
            )}
            {props.children}
        </>
    )
});

export default Loading;
