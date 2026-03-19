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
    select: (item: string) => void;
    /**
     * Fires when user clicks on selected item.
     */
    deselect: (item: string) => void;
};

const containerStyles = {
    width: '100%',
    padding: '0 15px',
    justifyContent: 'space-between',
    UserSelect: 'none',
    FlexWrap: 'nowrap',
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
    TextAlign: 'center',
    width: 30,
};

const listStyles = {
    gap: '10px',
};

function Carousel(props: CarouselProps) {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    return (
        <>
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
                        itemsToScroll: 2,
                        minWidth: 340,
                        maxWidth: 375,
                    },
                    {
                        itemsToScroll: 2,
                        maxWidth: 339,
                    },
                ]}
                itemsListProps={{
                    style: listStyles,
                }}
                speed={300}
                easing="linear"
                disableNavIfAllVisible
                hideNavIfAllVisible
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
        </>
    );
}

export default Carousel;
