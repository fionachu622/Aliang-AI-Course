import {colors} from '../theme';
import {FlowArrow, Pill, RevealAt} from './VisualKit';

const nodes = [
  {label: '输入文字', color: colors.blue},
  {label: 'Tokenizer', color: colors.green},
  {label: 'Token / ID', color: colors.coral},
  {label: '大模型', color: colors.dark},
  {label: '回答', color: colors.blue},
];

export const FlowMap = ({
  active = -1,
  at = 0,
  compact = false,
}: {
  active?: number;
  at?: number;
  compact?: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: compact ? 12 : 18,
    }}
  >
    {nodes.map((item, i) => (
      <div key={item.label} style={{display: 'flex', alignItems: 'center', gap: compact ? 12 : 18}}>
        <RevealAt at={at + i * 0.42}>
          <Pill
            color={item.color}
            ghost={active !== i}
            style={{
              width: compact ? 190 : 220,
              minHeight: compact ? 58 : 70,
              fontSize: compact ? 25 : 30,
              boxShadow: active === i ? `0 0 0 9px ${item.color}22` : undefined,
            }}
          >
            {item.label}
          </Pill>
        </RevealAt>
        {i < nodes.length - 1 ? (
          <RevealAt at={at + i * 0.42 + 0.18}>
            <FlowArrow width={compact ? 70 : 90} />
          </RevealAt>
        ) : null}
      </div>
    ))}
  </div>
);
