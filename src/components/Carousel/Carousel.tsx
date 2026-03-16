import styles from './Carousel.module.scss';
import { useState } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';
import CarouselChip from './CarouselChip/CarouselChip';

type CarouselProps = {
    /**
     * Array of strings
     */
    items: string[];
    /**
     * Array of strings selected by user
     */
    selectedItems: string[];
    /**
     * Fires when user clicks on deselected item.
     */
    select: () => void;
    /**
     * Fires when user clicks on selected item.
     */
    deselect: () => void;
};

const containerStyles = {
    gap: '10px',
};

const chevronStyles = {
    alignSelf: 'center',
    background: '#ff8f0b',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer',
    fontSize: '20px',
    height: 30,
    lineHeight: 1,
    textAlign: 'center',
    width: 30,
};

const listStyles = {
    gap: '15px',
};

function Carousel(props: CarouselProps) {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    return (
        <div>
            <ReactSimplyCarousel
                activeSlideIndex={activeSlideIndex}
                onRequestChange={setActiveSlideIndex}
                itemsToShow={3}
                itemsToScroll={2}
                containerProps={{
                    style: containerStyles,
                }}
                forwardBtnProps={{
                    style: chevronStyles,
                    children: <span>{`>`}</span>,
                }}
                backwardBtnProps={{
                    style: chevronStyles,
                    children: <span>{`<`}</span>,
                }}
                responsiveProps={[
                    {
                        itemsToShow: 3,
                        itemsToScroll: 2,
                        minWidth: 768,
                    },
                ]}
                itemsListProps={{
                    style: listStyles,
                }}
                speed={500}
                easing="linear"
            >
                {props.items.map((item, index) => {
                    const isActive = props.selectedItems.includes(item);
                    return (
                        <li key={`${item}-${index}`} className={styles.item}>
                            <CarouselChip text={item} isActive={isActive} select={() => props.select(item)} deselect={() => props.deselect(item)} />
                        </li>
                    );
                })}
            </ReactSimplyCarousel>
        </div>
    );
}

export default Carousel;
