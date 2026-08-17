import React, { useEffect, useMemo, useRef, useState } from 'react';

interface ComboboxProps {
	label: string;
	value: string;
	options: string[];
	onChange: (value: string) => void;
	placeholder?: string;
}

/**
 * A datalist gives no dropdown affordance, shows nothing until you type, and renders
 * differently per browser. This behaves like a normal select that also accepts new values:
 * click to see everything, type to filter, arrows and Enter to pick.
 */
export const Combobox: React.FC<ComboboxProps> = ({ label, value, options, onChange, placeholder }) => {
	const [open, setOpen] = useState(false);
	const [highlight, setHighlight] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	const matches = useMemo(() => {
		const needle = value.trim().toLowerCase();
		if (!needle) return options;
		return options.filter((option) => option.toLowerCase().includes(needle));
	}, [options, value]);

	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event: MouseEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
		};
		document.addEventListener('mousedown', onPointerDown);
		return () => document.removeEventListener('mousedown', onPointerDown);
	}, [open]);

	// Keep the highlighted row in view when navigating with the keyboard.
	useEffect(() => {
		if (!open) return;
		listRef.current?.children[highlight]?.scrollIntoView({ block: 'nearest' });
	}, [highlight, open]);

	const choose = (option: string) => {
		onChange(option);
		setOpen(false);
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			if (!open) {
				setOpen(true);
				return;
			}
			setHighlight((current) => {
				const next = event.key === 'ArrowDown' ? current + 1 : current - 1;
				return Math.max(0, Math.min(matches.length - 1, next));
			});
			return;
		}
		if (event.key === 'Enter' && open && matches[highlight]) {
			event.preventDefault();
			choose(matches[highlight]);
			return;
		}
		if (event.key === 'Escape' && open) {
			// Only close the list; the modal's own Escape handler should not also fire.
			event.stopPropagation();
			setOpen(false);
		}
	};

	const isNewValue = value.trim().length > 0 && !options.includes(value.trim());

	return (
		<div className="flex flex-col gap-1" ref={containerRef}>
			<span className="text-xs font-medium tracking-wide text-gray-400 uppercase">{label}</span>

			<div className="relative">
				<input
					value={value}
					autoComplete="off"
					placeholder={placeholder}
					onChange={(event) => {
						onChange(event.target.value);
						setOpen(true);
						setHighlight(0);
					}}
					onFocus={() => setOpen(true)}
					onKeyDown={onKeyDown}
					role="combobox"
					aria-expanded={open}
					aria-autocomplete="list"
					className="w-full rounded-md border border-gray-600 bg-gray-800 py-2 pr-9 pl-3 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
				<button
					type="button"
					tabIndex={-1}
					aria-label={`Show ${label.toLowerCase()} options`}
					onClick={() => setOpen((current) => !current)}
					className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-gray-400 hover:text-gray-200"
				>
					▾
				</button>

				{open && matches.length > 0 && (
					<ul
						ref={listRef}
						role="listbox"
						className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-gray-600 bg-gray-800 py-1 shadow-xl"
					>
						{matches.map((option, index) => (
							<li key={option}>
								<button
									type="button"
									role="option"
									aria-selected={option === value}
									onMouseEnter={() => setHighlight(index)}
									onClick={() => choose(option)}
									className={`block w-full px-3 py-1.5 text-left text-sm ${
										index === highlight ? 'bg-blue-600 text-white' : 'text-gray-200'
									}`}
								>
									{option}
								</button>
							</li>
						))}
					</ul>
				)}
			</div>

			{isNewValue && <span className="text-xs text-amber-400">New value — will be created</span>}
		</div>
	);
};
