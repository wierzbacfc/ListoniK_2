import { useState, useEffect, useRef } from 'react';
import { Plus, Check, Trash2, ShoppingCart, Settings, X, Moon, Sun, Monitor, Sparkles, EyeOff, Globe } from 'lucide-react';
import { getSavedDB, saveToDB, simulateAI, type ProductMeta } from './productDB';
import './index.css';

// Types
type Product = {
  id: string;
  name: string;
  category: string;
  icon: string;
  isDone: boolean;
  createdAt: number;
  quantity: number;
  promo?: string;
  isImportant?: boolean;
};

type ShoppingList = {
  id: string;
  name: string;
  items: Product[];
  createdAt: number;
  isPrivate?: boolean;
};

type Theme = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'normal' | 'large';
type AccentColor = 'purple' | 'blue' | 'green' | 'pink' | 'orange';

const ACCENT_COLORS: Record<AccentColor, { hsl: string; glow: string; label: string; emoji: string }> = {
  purple: { hsl: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', label: 'Fiolet', emoji: '🟣' },
  blue:   { hsl: '#3b82f6', glow: 'rgba(59,130,246,0.4)',  label: 'Niebieski', emoji: '🔵' },
  green:  { hsl: '#10b981', glow: 'rgba(16,185,129,0.4)',  label: 'Zielony', emoji: '🟢' },
  pink:   { hsl: '#ec4899', glow: 'rgba(236,72,153,0.4)',  label: 'Różowy', emoji: '🩷' },
  orange: { hsl: '#f97316', glow: 'rgba(249,115,22,0.4)',  label: 'Pomarańcz', emoji: '🟠' },
};

export default function App() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('app-theme') as Theme) || 'system');
  
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [listMenuOpenId, setListMenuOpenId] = useState<string | null>(null);
  
  const [isAILoading, setIsAILoading] = useState(false);
  const [productDB, setProductDB] = useState<Record<string, ProductMeta>>(getSavedDB);
  const [fontSize, setFontSize] = useState<FontSize>(() => (localStorage.getItem('app-font-size') as FontSize) || 'normal');
  const [accentColor, setAccentColor] = useState<AccentColor>(() => (localStorage.getItem('app-accent') as AccentColor) || 'purple');

  const swipeDeltaRef = useRef(0);
  const swipeIdRef = useRef<string | null>(null);
  const popupCloseTimeRef = useRef(0);
  const [pulse, setPulse] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingList = useRef(false);
  const startXList = useRef(0);
  const scrollLeftList = useRef(0);

  const handleListPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    isDraggingList.current = true;
    if (scrollContainerRef.current) {
      startXList.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeftList.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleListPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingList.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXList.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftList.current - walk;
  };

  const handleListPointerUp = () => {
    isDraggingList.current = false;
  };

  // Modals state
  const [activePopup, setActivePopup] = useState<{ type: 'qty' | 'promo', productId: string } | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddingAnimation, setIsAddingAnimation] = useState(false);
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isDragging = useRef(false);
  const executeOnRelease = useRef<((value: string) => void) | null>(null);

  // Load initial data
  useEffect(() => {
    const savedLists = localStorage.getItem('shopping-lists');

    if (savedLists) {
      const parsed = JSON.parse(savedLists);
      setLists(parsed);
      if (parsed.length > 0) setActiveListId(parsed[0].id);
    } else {
      const defaultList: ShoppingList = {
        id: crypto.randomUUID(),
        name: 'Główne zakupy',
        createdAt: Date.now(),
        items: []
      };
      setLists([defaultList]);
      setActiveListId(defaultList.id);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (lists.length > 0) {
      localStorage.setItem('shopping-lists', JSON.stringify(lists));
    }
  }, [lists]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Apply font size
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('app-font-size', fontSize);
  }, [fontSize]);

  // Apply accent color
  useEffect(() => {
    const c = ACCENT_COLORS[accentColor];
    document.documentElement.style.setProperty('--accent', c.hsl);
    document.documentElement.style.setProperty('--accent-glow', c.glow);
    localStorage.setItem('app-accent', accentColor);
  }, [accentColor]);

  // Drag-to-select: global pointer tracking
  useEffect(() => {
    // Track initial pointer position to cancel long-press if user scrolls
    let startX = 0;
    let startY = 0;

    const onDown = (e: PointerEvent) => {
      startX = e.clientX;
      startY = e.clientY;
    };

    const onMove = (e: PointerEvent) => {
      if (isDragging.current) {
        // Block page scroll during active drag
        e.preventDefault();
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const btn = el?.closest('[data-modal-option]') as HTMLElement | null;
        setHoveredOption(btn?.dataset.modalOption ?? null);
      } else {
        // Cancel long-press timer if finger moved too far (user is scrolling)
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx > 20 || dy > 20) {
          clearTimeout(pressTimer.current);
          pressTimer.current = undefined;
        }
      }
    };

    const onUp = (e: PointerEvent) => {
      clearTimeout(pressTimer.current);
      pressTimer.current = undefined;
      if (!isDragging.current) return;
      isDragging.current = false;
      const rootEl = document.getElementById('root');
      if (rootEl) rootEl.style.overflowY = 'auto';
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const btn = el?.closest('[data-modal-option]') as HTMLElement | null;
      const action = executeOnRelease.current;
      executeOnRelease.current = null;
      setHoveredOption(null);
      if (btn?.dataset.modalOption && action) {
        action(btn.dataset.modalOption);
      } else {
        popupCloseTimeRef.current = Date.now();
        setActivePopup(null);
      }
    };

    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointermove', onMove, { passive: false });
    document.addEventListener('pointerup', onUp);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, []);

  const activeList = lists.find(l => l.id === activeListId) || lists[0];

  const updateActiveListItems = (newItems: Product[]) => {
    setLists(prev => prev.map(list => 
      list.id === activeListId ? { ...list, items: newItems } : list
    ));
  };

  const handleAddItem = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let name = inputValue.trim();
    if (!name || !activeList) return;

    setIsAddingAnimation(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    setIsAddingAnimation(false);

    name = name.charAt(0).toUpperCase() + name.slice(1);
    setInputValue(''); // Wyczyść input od razu dla lepszego UX

    let meta = productDB[name.toLowerCase()];

    // Jeśli produktu nie ma w lokalnej bazie, uruchom AI
    if (!meta) {
      setIsAILoading(true);
      meta = await simulateAI(name);
      const newDB = saveToDB({ [name.toLowerCase()]: meta });
      setProductDB(newDB);
      setIsAILoading(false);
    }

    const newItem: Product = {
      id: crypto.randomUUID(),
      name: name,
      category: meta.category,
      icon: meta.icon,
      isDone: false,
      createdAt: Date.now(),
      quantity: 1
    };

    // Musimy użyć funkcji w setLists, aby mieć aktualny stan (bo AI mogło trwać kilka sekund)
    setLists(prevLists => prevLists.map(list => {
      if (list.id === activeListId) {
        return { ...list, items: [newItem, ...list.items] };
      }
      return list;
    }));

    setToastMessage('Produkt dodany');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const toggleItem = (id: string) => {
    if (!activeList) return;

    const item = activeList.items.find(i => i.id === id);
    if (item && !item.isDone) {
      setAnimatingItemId(id);
      setTimeout(() => setAnimatingItemId(null), 400);
    }

    const updatedItems = activeList.items.map(item =>
      item.id === id ? { ...item, isDone: !item.isDone } : item
    );
    updateActiveListItems(updatedItems);
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeList) return;
    
    const item = activeList.items.find(i => i.id === id);
    if (item && !item.isDone) {
      // Jeśli produkt jest aktywny, przenieś go do sekcji Zrealizowane (toggleItem)
      toggleItem(id);
    } else {
      // Jeśli produkt był już zrealizowany (lub nie znaleziono), usuń na dobre
      updateActiveListItems(activeList.items.filter(item => item.id !== id));
    }
  };

  const clearDoneItems = () => {
    if (!activeList) return;
    updateActiveListItems(activeList.items.filter(item => !item.isDone));
  };

  useEffect(() => {
    if (!activeList) return;
    const doneCount = activeList.items.filter(item => item.isDone).length;
    if (doneCount > 0) {
      setTimeout(() => setPulse(true), 0);
      const timeout = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [activeList?.items, activeList]);

  const closeModal = () => {
    popupCloseTimeRef.current = Date.now();
    setActivePopup(null);
  };

  const updateItemProperty = (id: string, updates: Partial<Product>) => {
    if (!activeList) return;
    updateActiveListItems(activeList.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    closeModal();
  };

  // Obsługa przytrzymania (Long Press) + Drag-to-select
  const handlePointerDown = (type: 'qty' | 'promo', id: string) => {
    pressTimer.current = setTimeout(() => {
      isDragging.current = true;
      const rootEl = document.getElementById('root');
      if (rootEl) rootEl.style.overflowY = 'hidden'; // lock scroll immediately
      executeOnRelease.current = (value: string) => {
        if (type === 'qty') {
          updateItemProperty(id, { quantity: parseInt(value) });
        } else {
          updateItemProperty(id, { promo: value === 'Brak' ? undefined : value });
        }
      };
      setActivePopup({ type, productId: id });
    }, 400);
  };

  const handlePillClick = (type: 'qty' | 'promo', id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging.current) return;
    if (Date.now() - popupCloseTimeRef.current < 1000) return;
    setActivePopup({ type, productId: id });
  };

  // Views functions
  const handleCreateNewList = () => {
    const name = newListName.trim();
    if (name) {
      const newList: ShoppingList = {
        id: crypto.randomUUID(),
        name: name,
        items: [],
        createdAt: Date.now()
      };
      setLists([newList, ...lists]);
      setActiveListId(newList.id);
      setNewListName('');
      setIsCreatingList(false);
    }
  };

  const confirmDeleteList = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (lists.length === 1) {
      return;
    }
    setListToDelete(id);
  };

  const executeDeleteList = () => {
    if (!listToDelete) return;
    const newLists = lists.filter(l => l.id !== listToDelete);
    setLists(newLists);
    if (activeListId === listToDelete) {
      setActiveListId(newLists[0].id);
    }
    setListToDelete(null);
  };

  const togglePrivate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLists(prev => prev.map(l =>
      l.id === id ? { ...l, isPrivate: !l.isPrivate } : l
    ));
  };

  // Renders...
  // Fix showSettings render directly overriding the rest if open
  if (showSettings) {
    const settingCard: React.CSSProperties = { display: 'block', padding: '20px', marginBottom: '12px' };
    const sectionTitle: React.CSSProperties = { margin: '0 0 14px 0', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' };
    const row: React.CSSProperties = { display: 'flex', gap: '8px' };
    const optBtn = (active: boolean): React.CSSProperties => ({
      flex: 1, padding: '10px 8px', borderRadius: '12px',
      border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
      background: active ? 'rgba(139,92,246,0.08)' : 'var(--surface)',
      color: 'var(--text-primary)', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
      fontSize: '13px', fontWeight: active ? 700 : 400,
      transition: 'all 0.2s ease',
    });

    return (
      <div style={{ padding: '20px', paddingBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1>Ustawienia</h1>
          <button onClick={() => setShowSettings(false)} className="delete-btn"><X size={24}/></button>
        </div>

        {/* Motyw */}
        <div className="item-card" style={settingCard}>
          <h2 style={sectionTitle}>Motyw aplikacji</h2>
          <div style={row}>
            <button onClick={() => setTheme('light')} style={optBtn(theme === 'light')}><Sun size={22} /> Jasny</button>
            <button onClick={() => setTheme('dark')}  style={optBtn(theme === 'dark')}>  <Moon size={22} /> Ciemny</button>
            <button onClick={() => setTheme('system')} style={optBtn(theme === 'system')}><Monitor size={22} /> System</button>
          </div>
        </div>

        {/* Rozmiar tekstu */}
        <div className="item-card" style={settingCard}>
          <h2 style={sectionTitle}>Rozmiar tekstu</h2>
          <div style={row}>
            <button onClick={() => setFontSize('small')}  style={optBtn(fontSize === 'small')}>  <span style={{ fontSize: '13px', fontWeight: 700 }}>A</span> Mały</button>
            <button onClick={() => setFontSize('normal')} style={optBtn(fontSize === 'normal')}><span style={{ fontSize: '17px', fontWeight: 700 }}>A</span> Normalny</button>
            <button onClick={() => setFontSize('large')}  style={optBtn(fontSize === 'large')}>  <span style={{ fontSize: '22px', fontWeight: 700 }}>A</span> Duży</button>
          </div>
        </div>

        {/* Kolor akcentu */}
        <div className="item-card" style={settingCard}>
          <h2 style={sectionTitle}>Kolor akcentu</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(Object.entries(ACCENT_COLORS) as [AccentColor, typeof ACCENT_COLORS[AccentColor]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setAccentColor(key)}
                style={{
                  flex: '1 1 calc(20% - 10px)', minWidth: '60px', padding: '12px 6px',
                  borderRadius: '12px',
                  border: accentColor === key ? `2px solid ${val.hsl}` : '1px solid var(--border)',
                  background: accentColor === key ? `${val.hsl}22` : 'var(--surface)',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  fontSize: '11px', color: 'var(--text-primary)', fontWeight: accentColor === key ? 700 : 400,
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '22px' }}>{val.emoji}</span>
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gemini API Key */}
        <div className="item-card" style={settingCard}>
          <h2 style={sectionTitle}>Klucz API Gemini (Opcjonalnie)</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            Aby funkcja sztucznej inteligencji działała po stronie klienta (np. na Netlify), podaj swój klucz API Gemini. Klucz jest zapisywany tylko w Twojej przeglądarce.
          </p>
          <input 
            type="password"
            placeholder="AIzaSy..."
            className="add-input"
            style={{ width: '100%', marginBottom: '12px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}
            defaultValue={localStorage.getItem('gemini_api_key') || ''}
            onChange={(e) => {
              if (e.target.value) {
                localStorage.setItem('gemini_api_key', e.target.value);
              } else {
                localStorage.removeItem('gemini_api_key');
              }
            }}
          />
        </div>

        {/* Firebase — info */}
        <div className="item-card" style={{ ...settingCard, opacity: 0.6 }}>
          <h2 style={sectionTitle}>Synchronizacja ☁️</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Po włączeniu Firebase listy będą synchronizować się w czasie rzeczywistym między urządzeniami.
            Listy oznaczone jako <strong>prywatne 🔒</strong> nie będą wysłane do chmury.
          </p>
          <div style={{ marginTop: '10px', padding: '8px 12px', background: 'var(--surface-hover)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Status: ⏳ Oczekuje na konfigurację Firebase
          </div>
        </div>
      </div>
    );
  }

  if (!activeList) return null;

  // Separate pending and done items
  const pendingItems = activeList.items.filter(i => !i.isDone);
  const doneItems = activeList.items.filter(i => i.isDone);

  // Group ONLY pending items by category
  const groupedItems = pendingItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Product[]>);

  // Sort categories (Inne at the end)
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    if (a === 'Inne') return 1;
    if (b === 'Inne') return -1;
    return a.localeCompare(b);
  });

  const totalItems = activeList.items.length;
  const doneCount = doneItems.length;
  const progress = totalItems === 0 ? 0 : (doneCount / totalItems) * 100;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Nabiał': '#3b82f6', // blue
      'Pieczywo': '#d97706', // amber
      'Warzywa & Owoce': '#22c55e', // green
      'Mięso & Wędliny': '#ef4444', // red
      'Ryby & Owoce Morza': '#06b6d4', // cyan
      'Mrożonki': '#38bdf8', // light blue
      'Napoje': '#6366f1', // indigo
      'Słodycze & Przekąski': '#ec4899', // pink
      'Sypkie & Przetwory': '#eab308', // yellow
      'Przyprawy & Sosy': '#f97316', // orange
      'Chemia & Higiena': '#8b5cf6', // purple
      'Dla Zwierząt': '#84cc16', // lime
      'Dla Dzieci & Niemowląt': '#f43f5e', // rose
      'Inne': '#9ca3af' // gray
    };
    return colors[category] || '#9ca3af';
  };

  const onTouchStartCard = (e: React.TouchEvent, id: string) => {
    swipeDeltaRef.current = 0;
    swipeIdRef.current = id;
    const touch = e.touches[0];
    (e.currentTarget as HTMLDivElement).dataset.startX = String(touch.clientX);
  };
  
  const onTouchMoveCard = (e: React.TouchEvent) => {
    if (swipeIdRef.current === null) return;
    const touch = e.touches[0];
    const startX = parseFloat((e.currentTarget as HTMLDivElement).dataset.startX || '0');
    swipeDeltaRef.current = touch.clientX - startX;
  };

  const onTouchEndCard = (id: string) => {
    if (swipeIdRef.current === id && Math.abs(swipeDeltaRef.current) > 50) {
      toggleItem(id);
    }
    swipeIdRef.current = null;
  };

  const handleCardClick = (id: string) => {
    // Prevent ghost click right after closing popup
    if (Date.now() - popupCloseTimeRef.current < 1000) return;
    if (Math.abs(swipeDeltaRef.current) > 50) {
      swipeDeltaRef.current = 0;
      return; 
    }
    toggleItem(id);
  };

  return (
    <>
      <header style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', 
        width: 'calc(100% + 32px)', margin: '0 -16px 8px -16px',
        padding: '16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <button onClick={() => setIsCreatingList(true)} style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer', padding: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} />
        </button>

        <div 
          ref={scrollContainerRef}
          onPointerDown={handleListPointerDown}
          onPointerMove={handleListPointerMove}
          onPointerUp={handleListPointerUp}
          onPointerLeave={handleListPointerUp}
          style={{ display: 'flex', gap: '8px', overflowX: 'auto', flex: 1, minWidth: 0, padding: '4px 0', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }} 
          className="hide-scrollbar"
        >
          {lists.map(list => {
            const isMenuOpen = listMenuOpenId === list.id;
            return (
            <div key={list.id} style={{ position: 'relative' }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (scrollContainerRef.current) {
                    const dx = Math.abs(scrollContainerRef.current.scrollLeft - scrollLeftList.current);
                    if (isDraggingList.current && dx > 5) return;
                  }
                  if (activeListId !== list.id) {
                    setActiveListId(list.id);
                  } else {
                    setListMenuOpenId(isMenuOpen ? null : list.id);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setListMenuOpenId(isMenuOpen ? null : list.id);
                }}
                onPointerDown={() => {
                  
                  pressTimer.current = setTimeout(() => {
                    setListMenuOpenId(list.id);
                  }, 500);
                }}
                onPointerUp={() => {  clearTimeout(pressTimer.current); }}
                onPointerLeave={() => {  clearTimeout(pressTimer.current); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  padding: `10px 18px 10px ${list.isPrivate ? 26 : 18}px`,
                  borderRadius: '10px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: activeListId === list.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: activeListId === list.id ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-color)',
                  color: activeListId === list.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: activeListId === list.id ? 700 : 500,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
              >
                {list.isPrivate && <span className="private-badge" style={{ margin: 0 }}>PRIV</span>}
                {list.name}
              </button>
            </div>
          )})}
        </div>

        <button onClick={() => setShowSettings(true)} style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer', padding: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={20} />
        </button>
      </header>

      {totalItems > 0 && (
        <div style={{ 
          marginBottom: '16px',
          background: 'var(--surface-hover)', 
          borderRadius: '12px', 
          border: '1px solid var(--border)',
          boxShadow: pulse ? '0 0 12px var(--accent)' : 'inset 0 1px 3px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.3s ease',
          height: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', top: 0, left: 0, height: '100%', 
            width: `${progress}%`, background: 'var(--success)', 
            transition: 'width 0.3s ease',
            opacity: 0.85
          }} />
          <div style={{ 
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 800, letterSpacing: '0.05em',
            color: 'var(--text-primary)',
            textShadow: '0 0 4px var(--surface), 0 0 6px var(--surface)',
            zIndex: 2
          }}>
            {doneCount} / {totalItems}
          </div>
        </div>
      )}

      <main>
        {activeList.items.length === 0 ? (
          <div className="empty-state">
            <ShoppingCart />
            <h3>Lista jest pusta</h3>
            <p>Dodaj produkty poniżej.</p>
          </div>
        ) : (
          <>
            {/* Pending items grouped by category */}
            {sortedCategories.map(category => {
              const categoryItems = groupedItems[category].sort((a, b) => b.createdAt - a.createdAt);

              return (
                <div key={category} className="category-group" style={{ '--cat-color': getCategoryColor(category) } as React.CSSProperties}>
                  <div className="category-header">
                    <div className="category-header-icon">{categoryItems[0]?.icon}</div>
                    {category}
                  </div>
                  <div className="items-list">
                    {categoryItems.map(item => (
                      <div 
                        key={item.id} 
                        className={`item-card ${animatingItemId === item.id ? 'item-added-animation' : ''} ${item.isImportant ? 'is-important' : ''}`}
                        onClick={() => handleCardClick(item.id)}
                        onTouchStart={(e) => onTouchStartCard(e, item.id)}
                        onTouchMove={onTouchMoveCard}
                        onTouchEnd={() => onTouchEndCard(item.id)}
                      >
                        <div className="item-info">
                          <div className="checkbox">
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <span className="item-name">{item.name}</span>
                          
                          <div className="item-actions" onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                            <div 
                              className={`pill ${item.quantity !== 1 ? 'active-pill' : ''}`} 
                              onPointerDown={() => handlePointerDown('qty', item.id)}
                              onClick={(e) => handlePillClick('qty', item.id, e)}
                            >
                              {item.quantity === 1 ? '- szt' : `${item.quantity} szt.`}
                            </div>
                            <div 
                              className={`pill ${item.promo ? 'active-pill' : ''}`}
                              onPointerDown={() => handlePointerDown('promo', item.id)}
                              onClick={(e) => handlePillClick('promo', item.id, e)}
                            >
                              {item.promo || '+ Promo'}
                            </div>
                            <div 
                              className={`pill important-btn ${item.isImportant ? 'active-pill important-btn-active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateItemProperty(item.id, { isImportant: !item.isImportant });
                              }}
                            >
                              <strong>!</strong>
                            </div>
                          </div>
                        </div>
                        <button 
                          className="delete-btn" 
                          onClick={(e) => deleteItem(item.id, e)}
                          aria-label="Usuń"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Done items – flat list at the bottom */}
            {doneItems.length > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 10px 0' }}>
                  <button 
                    onClick={clearDoneItems}
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Trash2 size={14} />
                    Usuń zaznaczone
                  </button>
                </div>
                <div className="done-section">
                  <div className="done-section-header">
                    <Check size={14} strokeWidth={3} />
                    Zrobione ({doneItems.length})
                  </div>
                  <div className="items-list">
                    {doneItems.map(item => (
                      <div 
                        key={item.id} 
                        className={`item-card is-done ${animatingItemId === item.id ? 'item-added-animation' : ''} ${item.isImportant ? 'is-important' : ''}`}
                        onClick={() => handleCardClick(item.id)}
                        onTouchStart={(e) => onTouchStartCard(e, item.id)}
                        onTouchMove={onTouchMoveCard}
                        onTouchEnd={() => onTouchEndCard(item.id)}
                      >
                      <div className="item-info">
                        <div className="checkbox">
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="item-name">{item.name}</span>
                      </div>
                      <button 
                        className="delete-btn" 
                        onClick={(e) => deleteItem(item.id, e)}
                        aria-label="Usuń"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
            )}
          </>
        )}
      </main>

      <div className="bottom-bar">
        <form className="input-container" onSubmit={handleAddItem}>
          <input
            type="text"
            className="add-input"
            placeholder="Co kupujemy?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className={`add-btn ${isAddingAnimation ? 'animating-btn' : ''}`} disabled={!inputValue.trim() || isAILoading}>
            {isAILoading ? <Sparkles size={20} className="spinner" /> : <Plus size={24} />}
          </button>
        </form>
      </div>

      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--surface-hover)',
          color: 'var(--text-primary)',
          padding: '10px 20px',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid var(--border)',
          zIndex: 1000,
          fontWeight: 600,
          fontSize: '14px',
          animation: 'slideUpFade 0.3s ease-out'
        }}>
          {toastMessage}
        </div>
      )}

      {/* MODALS */}
      {listMenuOpenId && (() => {
        const openedList = lists.find(l => l.id === listMenuOpenId);
        if (!openedList) return null;
        return (
          <div className="modal-overlay" onClick={() => setListMenuOpenId(null)} style={{ alignItems: 'flex-end', paddingBottom: '32px' }}>
            <div className="modal-content" style={{ padding: '8px', animation: 'slideUpFade 0.3s ease', borderRadius: '16px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                Opcje listy: {openedList.name}
              </div>
              <button
                className="modal-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '16px', color: 'var(--text-primary)', border: 'none', background: 'transparent', fontSize: '16px' }}
                onClick={(e) => { setListMenuOpenId(null); togglePrivate(openedList.id, e); }}
              >
                {openedList.isPrivate ? <><Globe size={18} /> Zmień na publiczną</> : <><EyeOff size={18} /> Zmień na prywatną</>}
              </button>
              <button
                className="modal-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '16px', color: 'var(--danger)', border: 'none', background: 'transparent', borderTop: '1px solid var(--border)', fontSize: '16px' }}
                onClick={(e) => { setListMenuOpenId(null); confirmDeleteList(openedList.id, e); }}
                disabled={lists.length === 1}
              >
                <Trash2 size={18} /> Usuń listę
              </button>
            </div>
          </div>
        );
      })()}

      {listToDelete && (
        <div className="modal-overlay" onClick={() => setListToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, textAlign: 'center', marginBottom: '16px' }}>
              Usunąć listę?
            </h3>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Czy na pewno chcesz usunąć tę listę? Te działania nie można cofnąć.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={executeDeleteList}
                style={{ flex: 1, padding: '12px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Usuń
              </button>
              <button 
                onClick={() => setListToDelete(null)}
                style={{ flex: 1, padding: '12px', background: 'var(--surface-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {activePopup && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, textAlign: 'center' }}>
              {activePopup.type === 'qty' ? 'Wybierz ilość' : 'Rodzaj promocji'}
            </h3>
            
            {activePopup.type === 'qty' ? (
              <div className="modal-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button 
                    key={num} 
                    className={`modal-btn ${hoveredOption === String(num) ? 'is-hovered' : ''}`}
                    data-modal-option={String(num)}
                    onClick={() => updateItemProperty(activePopup.productId, { quantity: num })}
                  >
                    {num}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                {['Brak', '1+1', '2+1', '2+2', 'Kupon', 'Z kartą'].map(promo => (
                  <button 
                    key={promo}
                    className={`modal-btn ${hoveredOption === promo ? 'is-hovered' : ''}`}
                    data-modal-option={promo}
                    style={{ padding: '12px', fontSize: '16px' }}
                    onClick={() => updateItemProperty(activePopup.productId, { promo: promo === 'Brak' ? undefined : promo })}
                  >
                    {promo}
                  </button>
                ))}
              </div>
            )}
            
            <button 
              onClick={closeModal}
              style={{ width: '100%', padding: '12px', marginTop: '20px', background: 'transparent', color: 'var(--text-secondary)', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
      {isCreatingList && (
        <div className="modal-overlay" onClick={() => setIsCreatingList(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>Nowa lista</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                autoFocus
                className="add-input"
                style={{ width: '100%', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}
                placeholder="Nazwa nowej listy"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                onKeyDown={e => {
                   if (e.key === 'Enter') handleCreateNewList();
                   if (e.key === 'Escape') { setIsCreatingList(false); setNewListName(''); }
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={handleCreateNewList}
                  disabled={!newListName.trim()}
                  style={{ flex: 1, padding: '10px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: newListName.trim() ? 1 : 0.5 }}
                >
                  Utwórz
                </button>
                <button 
                  onClick={() => { setIsCreatingList(false); setNewListName(''); }}
                  style={{ flex: 1, padding: '10px', background: 'var(--surface-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
