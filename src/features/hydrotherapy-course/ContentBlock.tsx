import React from 'react';
import {
  AlertTriangle,
  BookOpen,
  FlaskConical,
  Stethoscope,
  ClipboardList,
  Lightbulb,
  FileText,
  Activity,
} from 'lucide-react';
import type { ContentBlock as ContentBlockType } from './types';

function renderMarkdownBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function KeyTermsBadges({ keyTerms }: { keyTerms: ContentBlockType['keyTerms'] }) {
  if (!keyTerms || keyTerms.length === 0) return null;
  return (
    <div className="hc-key-terms">
      {keyTerms.map((term, i) => (
        <span key={i} className="hc-key-term">
          <span className="hc-key-term__he">{term.he}</span>
          <span className="hc-key-term__en">{term.en}</span>
        </span>
      ))}
    </div>
  );
}

function BlockHeader({ title, icon: Icon, className }: { title?: string; icon?: React.ElementType; className?: string }) {
  if (!title) return null;
  return (
    <h4 className={`hc-block__title ${className ?? ''}`}>
      {Icon && <Icon size={18} className="hc-block__title-icon" />}
      <span>{renderMarkdownBold(title)}</span>
    </h4>
  );
}

function TextBlock({ block }: { block: ContentBlockType }) {
  return (
    <div className="hc-block hc-block--text">
      {block.title && <BlockHeader title={block.title} />}
      <p className="hc-block__text">{renderMarkdownBold(block.text)}</p>
      <KeyTermsBadges keyTerms={block.keyTerms} />
    </div>
  );
}

function DefinitionBlock({ block }: { block: ContentBlockType }) {
  return (
    <div className="hc-block hc-block--definition">
      <BlockHeader title={block.title} icon={BookOpen} className="hc-block__title--definition" />
      <p className="hc-block__text">{renderMarkdownBold(block.text)}</p>
      <KeyTermsBadges keyTerms={block.keyTerms} />
    </div>
  );
}

function FormulaBlock({ block }: { block: ContentBlockType }) {
  return (
    <div className="hc-block hc-block--formula">
      <BlockHeader title={block.title} icon={FlaskConical} className="hc-block__title--formula" />
      <div className="hc-formula__equation">{renderMarkdownBold(block.text)}</div>
      {block.variables && block.variables.length > 0 && (
        <div className="hc-formula__variables">
          {block.variables.map((v, i) => (
            <div key={i} className="hc-formula__var">
              <span className="hc-formula__symbol">{v.symbol}</span>
              <span className="hc-formula__desc">{v.description}</span>
            </div>
          ))}
        </div>
      )}
      <KeyTermsBadges keyTerms={block.keyTerms} />
    </div>
  );
}

function WarningBlock({ block }: { block: ContentBlockType }) {
  return (
    <div className="hc-block hc-block--warning">
      <BlockHeader title={block.title} icon={AlertTriangle} className="hc-block__title--warning" />
      <p className="hc-block__text">{renderMarkdownBold(block.text)}</p>
      <KeyTermsBadges keyTerms={block.keyTerms} />
    </div>
  );
}

function ClinicalBlock({ block, variant }: { block: ContentBlockType; variant: string }) {
  const iconMap: Record<string, React.ElementType> = {
    clinical_application: Stethoscope,
    clinical_example: Activity,
    clinical_analysis: Activity,
    clinical_implication: Stethoscope,
  };
  const Icon = iconMap[variant] ?? Stethoscope;

  return (
    <div className={`hc-block hc-block--clinical hc-block--${variant.replace('_', '-')}`}>
      <BlockHeader title={block.title} icon={Icon} className="hc-block__title--clinical" />
      <p className="hc-block__text">{renderMarkdownBold(block.text)}</p>
      <KeyTermsBadges keyTerms={block.keyTerms} />
    </div>
  );
}

function EnrichmentBlock({ block }: { block: ContentBlockType }) {
  return (
    <div className="hc-block hc-block--enrichment">
      <BlockHeader title={block.title} icon={Lightbulb} className="hc-block__title--enrichment" />
      <p className="hc-block__text">{renderMarkdownBold(block.text)}</p>
      <KeyTermsBadges keyTerms={block.keyTerms} />
    </div>
  );
}

function ProtocolBlock({ block }: { block: ContentBlockType }) {
  return (
    <div className="hc-block hc-block--protocol">
      <BlockHeader title={block.title} icon={ClipboardList} className="hc-block__title--protocol" />
      <p className="hc-block__text">{renderMarkdownBold(block.text)}</p>
      <KeyTermsBadges keyTerms={block.keyTerms} />
    </div>
  );
}

function ListBlock({ block }: { block: ContentBlockType }) {
  const Tag = block.ordered ? 'ol' : 'ul';
  return (
    <div className="hc-block hc-block--list">
      <BlockHeader title={block.title} icon={FileText} />
      {block.text && <p className="hc-block__text hc-block__text--list-intro">{renderMarkdownBold(block.text)}</p>}
      {block.items && (
        <Tag className={`hc-list ${block.ordered ? 'hc-list--ordered' : 'hc-list--unordered'}`}>
          {block.items.map((item, i) => (
            <li key={i} className="hc-list__item">
              {item.title && <strong className="hc-list__item-title">{item.title}: </strong>}
              <span>{renderMarkdownBold(item.text)}</span>
            </li>
          ))}
        </Tag>
      )}
      <KeyTermsBadges keyTerms={block.keyTerms} />
    </div>
  );
}

function TableBlock({ block }: { block: ContentBlockType }) {
  return (
    <div className="hc-block hc-block--table">
      <BlockHeader title={block.title} />
      {block.text && <p className="hc-block__text hc-block__text--table-desc">{renderMarkdownBold(block.text)}</p>}
      {block.headers && block.rows && (
        <div className="hc-table__wrapper">
          <table className="hc-table">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <KeyTermsBadges keyTerms={block.keyTerms} />
    </div>
  );
}

export const ContentBlockRenderer: React.FC<{ block: ContentBlockType }> = ({ block }) => {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />;
    case 'definition':
      return <DefinitionBlock block={block} />;
    case 'formula':
      return <FormulaBlock block={block} />;
    case 'warning':
      return <WarningBlock block={block} />;
    case 'clinical_application':
    case 'clinical_example':
    case 'clinical_analysis':
    case 'clinical_implication':
      return <ClinicalBlock block={block} variant={block.type} />;
    case 'enrichment':
      return <EnrichmentBlock block={block} />;
    case 'protocol':
      return <ProtocolBlock block={block} />;
    case 'list':
      return <ListBlock block={block} />;
    case 'table':
      return <TableBlock block={block} />;
    default:
      return <TextBlock block={block} />;
  }
};
