import Popup from '../../components/Popups/Popup/Popup';
import { useNavigate } from 'react-router-dom';
import styles from './LisenceAgreement.module.scss';
import { lisenceAgreement } from './data';

function LisenceAgreement() {
    const navigate = useNavigate();
    const onClose = () => {
        navigate('/');
    };

    return (
        <Popup title={lisenceAgreement.title} arrowBack previousPageRoute="/feedback" onClose={onClose}>
            <div className={styles['lisence-agreement__container']}>
                <Paragraphs paragraphs={lisenceAgreement.introduction.paragraphs} />
                {lisenceAgreement.main.articles.map((a: (typeof lisenceAgreement.main.articles)[0]) => {
                    return (
                        <article>
                            <h3 className={styles['lisence-agreement__heading']}>{`${a.id}. ${a.title}`}</h3>
                            <Paragraphs paragraphs={a.paragraphs} />
                        </article>
                    );
                })}
            </div>
        </Popup>
    );
}

function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
    return (
        <div className={styles['lisence-agreement__paragraphs-container']}>
            {paragraphs.map((p) => {
                return <p className={styles['lisence-agreement__paragraph']}>{p}</p>;
            })}
        </div>
    );
}

export default LisenceAgreement;
