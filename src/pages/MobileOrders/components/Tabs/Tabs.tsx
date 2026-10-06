import styles from './Tabs.module.scss';

type TabsProps = {
    activeTab: TabName;
    onTabChange: (tab: TabName) => void;
};

type TabName = 'new' | 'inWork' | 'ready' | 'preorder';

const tabs = [
    { name: 'new' as TabName, label: 'Новые', count: 1 },
    { name: 'inWork' as TabName, label: 'В работе', count: 2 },
    { name: 'ready' as TabName, label: 'Готовы', count: 3 },
    { name: 'preorder' as TabName, label: 'Предзаказ', count: 0 },
];

function Tabs({ activeTab, onTabChange }: TabsProps) {
    return (
        <div className={styles['tabs']}>
            {tabs.map((tab) => (
                <button key={tab.name} className={`${styles['tab']} ${activeTab === tab.name ? styles['tab--mode_active'] : ''}`} onClick={() => onTabChange(tab.name)}>
                    <span className={`${styles['tab__label']} ${activeTab === tab.name ? styles['tab__label_mode_active'] : ''}`}>{tab.label}</span>
                    {tab.count > 0 && <span className={`${styles['tab__count']} ${activeTab === tab.name ? styles['tab__count_mode_active'] : ''}`}>{tab.count}</span>}
                </button>
            ))}
        </div>
    );
}

export default Tabs;
