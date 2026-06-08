import { useState } from 'react'
import { useVoting, shortAddr } from './useVoting'
import { CONTRACT_ADDRESS } from './contract'

const STATE_LABELS = ['Not Started', 'Active', 'Ended']
const STATE_COLORS = ['#854F0B', '#27500A', '#A32D2D']
const STATE_BG = ['#FAEEDA', '#EAF3DE', '#FCEBEB']
const CHART_COLORS = ['#185FA5', '#639922', '#BA7517', '#993556', '#534AB7', '#0F6E56', '#7A3B00', '#1A6B7A']

function Badge({ children, color = '#5F5E5A', bg = '#F1EFE8' }) {
  return (
    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, color, background: bg, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface-1)', border: '0.5px solid var(--border)',
      borderRadius: 12, padding: '1rem 1.25rem', ...style,
    }}>
      {children}
    </div>
  )
}

function SectionTitle({ children, right }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 11, fontWeight: 600, color: 'var(--text-2)',
      textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12,
    }}>
      <span>{children}</span>
      {right && <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>{right}</span>}
    </div>
  )
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '12px 14px', minWidth: 0 }}>
      <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || 'var(--text-1)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

function Btn({ children, onClick, disabled, color = '#185FA5', bg = '#E6F1FB', style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '7px 14px', borderRadius: 8, border: 'none',
        background: disabled ? 'var(--surface-2)' : bg,
        color: disabled ? 'var(--text-2)' : color,
        fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 500, opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.15s', whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function FullScreenLoader({ label }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(248, 247, 244, 0.82)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem',
    }}>
      <div style={{
        minWidth: 240,
        maxWidth: 360,
        background: 'var(--surface-1)',
        border: '0.5px solid var(--border)',
        borderRadius: 18,
        padding: '1.5rem',
        textAlign: 'center',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.12)',
      }}>
        <div style={{
          width: 54,
          height: 54,
          margin: '0 auto 1rem',
          borderRadius: '50%',
          border: '4px solid rgba(24, 95, 165, 0.15)',
          borderTopColor: '#185FA5',
          animation: 'spin 0.9s linear infinite',
        }} />
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>
          Please wait
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</div>
      </div>
    </div>
  )
}

function AddrInput({ placeholder, disabled, buttonLabel, buttonBg, buttonColor, onSubmit }) {
  const [val, setVal] = useState('')
  const go = async () => { if (await onSubmit(val.trim())) setVal('') }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && go()}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11,
          padding: '7px 10px', border: '0.5px solid var(--border)',
          borderRadius: 8, background: disabled ? 'var(--surface-2)' : 'var(--surface-1)',
          color: 'var(--text-1)', opacity: disabled ? 0.5 : 1,
        }}
      />
      <Btn onClick={go} disabled={disabled || !val.trim()} bg={buttonBg} color={buttonColor}>
        {buttonLabel}
      </Btn>
    </div>
  )
}

function DonutChart({ candidates, totalVotes }) {
  if (!candidates.length || totalVotes === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-2)', fontSize: 12 }}>
        No votes yet
      </div>
    )
  }

  const size = 140
  const cx = 70
  const cy = 70
  const r = 50
  const stroke = 22
  const circumference = 2 * Math.PI * r
  let offset = 0
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes)
  const slices = sorted.map((c, i) => {
    const pct = c.votes / totalVotes
    const dash = pct * circumference
    const gap = circumference - dash
    const slice = { ...c, dash, gap, offset, color: CHART_COLORS[i % CHART_COLORS.length], pct }
    offset += dash
    return slice
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset + circumference / 4}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontSize: 18, fontWeight: 700, fill: 'var(--text-1)', fontFamily: 'var(--font-sans)' }}>
          {totalVotes}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontSize: 10, fill: 'var(--text-2)', fontFamily: 'var(--font-sans)' }}>
          votes
        </text>
      </svg>
      <div style={{ flex: 1, minWidth: 120 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <code style={{ fontSize: 11, color: 'var(--text-1)', flex: 1 }}>{shortAddr(s.addr)}</code>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{s.votes}</span>
            <span style={{ fontSize: 11, color: 'var(--text-2)', minWidth: 32 }}>({Math.round(s.pct * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CandidateRow({ c, rank, total, canVote, onVote, isWinner, color }) {
  const pct = total > 0 ? (c.votes / total) * 100 : 0

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '22px 1fr 100px 60px auto',
      alignItems: 'center',
      gap: 10,
      padding: '9px 0',
      borderBottom: '0.5px solid var(--border)',
    }}>
      <span style={{ fontSize: 11, color: 'var(--text-2)', textAlign: 'right' }}>{rank}</span>
      <div>
        <code style={{
          fontSize: 11,
          display: 'block',
          color: isWinner ? '#3B6D11' : 'var(--text-1)',
          fontFamily: 'var(--font-mono)',
        }}>
          {c.addr} {isWinner && 'Winner'}
        </code>
        <div style={{ marginTop: 4, background: 'var(--surface-2)', height: 5, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
        </div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-2)' }}>{Math.round(pct)}%</div>
      <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{c.votes}</div>
      <div style={{ minWidth: 60 }}>
        {canVote && (
          <Btn onClick={() => onVote(c.addr)} bg="#185FA5" color="#fff" style={{ fontSize: 12, padding: '4px 12px' }}>
            Vote
          </Btn>
        )}
      </div>
    </div>
  )
}

function VoterList({ voters }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? voters : voters.slice(0, 5)

  return (
    <div>
      {shown.map((v, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 0', borderBottom: '0.5px solid var(--border)',
        }}>
          <span style={{ fontSize: 10, color: 'var(--text-2)', minWidth: 18, textAlign: 'right' }}>{i + 1}</span>
          <code style={{ fontSize: 11, color: 'var(--text-1)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{v}</code>
        </div>
      ))}
      {voters.length > 5 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            marginTop: 6, fontSize: 11, color: '#185FA5', background: 'none',
            border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          {expanded ? 'Show less' : `Show ${voters.length - 5} more`}
        </button>
      )}
    </div>
  )
}

function TxLog({ logs }) {
  const colorMap = { ok: '#3B6D11', err: '#A32D2D', info: '#185FA5' }

  return (
    <div style={{
      background: 'var(--surface-2)', borderRadius: 8, padding: 10,
      fontFamily: 'var(--font-mono)', fontSize: 11,
      maxHeight: 160, overflowY: 'auto',
    }}>
      {logs.length === 0
        ? <span style={{ color: 'var(--text-2)' }}>No transactions yet.</span>
        : logs.map((l) => (
          <div key={l.id} style={{ padding: '2px 0', color: colorMap[l.type], borderBottom: '0.5px solid var(--border)' }}>
            <span style={{ color: 'var(--text-2)' }}>[{l.t}]</span> {l.msg}
          </div>
        ))}
    </div>
  )
}

export default function App() {
  const {
    account, isOwner, votingState, candidates, voters,
    winner, roundNumber, logs, loading, actionLoading, myVoted, myRegistered,
    connectWallet, addCandidate, addVoter,
    startVoting, endVoting, resetVoting, castVote, refreshVotes,
  } = useVoting()

  const totalVotes = candidates.reduce((s, c) => s + c.votes, 0)
  const isNotStarted = votingState === 0
  const isActive = votingState === 1
  const isEnded = votingState === 2
  const canVote = isActive && myRegistered && !myVoted
  const sortedCands = [...candidates].sort((a, b) => b.votes - a.votes)

  const loaderLabelMap = {
    connectWallet: 'Connecting wallet to MST Blockchain Testnet...', 
    addCandidate: 'Adding candidate on-chain...',
    addVoter: 'Registering voter on-chain...',
    startVoting: 'Starting voting session...',
    endVoting: 'Ending voting session...',
    resetVoting: 'Preparing a new voting round...',
    refreshVotes: 'Refreshing vote counts...',
  }

  const loaderLabel = actionLoading?.startsWith('castVote:')
    ? 'Submitting your vote...'
    : (loaderLabelMap[actionLoading] || 'Processing transaction...')

  if (!account) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: 380 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: 28 }}>
            V
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--text-1)' }}>MST Vote</h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.6 }}>
            Decentralized voting on MST Blockchain Testnet.<br />Connect your wallet to participate.
          </p>
          <Btn onClick={connectWallet} disabled={loading} bg="#185FA5" color="#fff" style={{ fontSize: 15, padding: '10px 32px' }}>
            Connect MetaMask
          </Btn>
          <p style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 12 }}>MST Blockchain Testnet required</p>
          <p style={{ fontSize: 10, color: 'var(--text-2)', marginTop: 4, fontFamily: 'monospace' }}>
            {CONTRACT_ADDRESS}
          </p>
        </div>
        {loading && <FullScreenLoader label={loaderLabel} />}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '1.5rem', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ borderBottom: '0.5px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)' }}>MST Vote</h1>
              <p style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
                {CONTRACT_ADDRESS} · MST Testnet
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge color={STATE_COLORS[votingState]} bg={STATE_BG[votingState]}>
                {STATE_LABELS[votingState]}
              </Badge>
              <Badge color="#533490" bg="#EEEDFE">Round #{roundNumber}</Badge>
              {isOwner
                ? <Badge color="#854F0B" bg="#FAEEDA">Owner</Badge>
                : <Badge>{myRegistered ? 'Registered Voter' : 'Visitor'}</Badge>}
              <Badge>{shortAddr(account)}</Badge>
            </div>
          </div>

          {!isOwner && (
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {isActive && !myRegistered && <Badge color="#A32D2D" bg="#FCEBEB">Not registered - ask owner</Badge>}
              {isActive && myRegistered && !myVoted && <Badge color="#27500A" bg="#EAF3DE">Registered - cast your vote</Badge>}
              {myVoted && <Badge color="#27500A" bg="#EAF3DE">Already voted this round</Badge>}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
          <MetricCard label="Candidates" value={candidates.length} sub="registered" />
          <MetricCard label="Voters" value={voters.length} sub="registered" />
          <MetricCard label="Total Votes" value={totalVotes} sub="cast so far" color="#185FA5" />
          <MetricCard
            label="Leading Votes"
            value={candidates.length > 0 ? Math.max(...candidates.map((c) => c.votes)) : 0}
            sub="current lead"
            color="#639922"
          />
          <MetricCard label="Voting Round" value={`#${roundNumber}`} sub="current" color="#533490" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isOwner && (
              <Card>
                <SectionTitle>Owner Controls</SectionTitle>

                <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 6 }}>Add Candidate</div>
                <AddrInput
                  placeholder="0x... candidate address"
                  disabled={!isNotStarted || loading}
                  buttonLabel="Add"
                  buttonBg="#185FA5"
                  buttonColor="#fff"
                  onSubmit={addCandidate}
                />

                <div style={{ fontSize: 11, color: 'var(--text-2)', margin: '10px 0 6px' }}>Add Voter</div>
                <AddrInput
                  placeholder="0x... voter address"
                  disabled={!isNotStarted || loading}
                  buttonLabel="Add"
                  buttonBg="#185FA5"
                  buttonColor="#fff"
                  onSubmit={addVoter}
                />

                <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                  <Btn onClick={startVoting} disabled={!isNotStarted || loading} bg="#EAF3DE" color="#27500A">
                    Start
                  </Btn>
                  <Btn onClick={endVoting} disabled={!isActive || loading} bg="#FCEBEB" color="#A32D2D">
                    End
                  </Btn>
                  {isActive && (
                    <Btn onClick={refreshVotes} disabled={loading} bg="var(--surface-2)" color="var(--text-1)">
                      Refresh
                    </Btn>
                  )}
                </div>

                {isEnded && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '0.5px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 8 }}>
                      Start a new voting round - resets all candidates, voters and votes.
                    </div>
                    <Btn
                      onClick={resetVoting}
                      disabled={loading}
                      bg="#EEEDFE"
                      color="#533490"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Start New Round
                    </Btn>
                  </div>
                )}
              </Card>
            )}

            <Card>
              <SectionTitle right={`${candidates.length} total`}>Registered Candidates</SectionTitle>
              {candidates.length === 0
                ? <p style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    {isOwner && isNotStarted ? 'Add candidates above.' : 'None registered yet.'}
                  </p>
                : candidates.map((c, i) => (
                  <div key={c.addr} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 0', borderBottom: '0.5px solid var(--border)',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
                    <code style={{ fontSize: 11, color: 'var(--text-1)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all', flex: 1 }}>
                      {c.addr}
                    </code>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-1)' }}>{c.votes}v</span>
                  </div>
                ))}
            </Card>

            <Card>
              <SectionTitle right={`${voters.length} total`}>Registered Voters</SectionTitle>
              {voters.length === 0
                ? <p style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    {isOwner && isNotStarted ? 'Add voters above.' : 'None registered yet.'}
                  </p>
                : <VoterList voters={voters} />}
            </Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Card>
              <SectionTitle right={`${totalVotes} vote${totalVotes !== 1 ? 's' : ''} cast`}>
                Live Vote Tally
              </SectionTitle>

              {sortedCands.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>No candidates yet.</p>
              )}

              {sortedCands.map((c) => (
                <CandidateRow
                  key={c.addr}
                  c={c}
                  rank={sortedCands.findIndex((item) => item.addr === c.addr) + 1}
                  total={totalVotes}
                  canVote={canVote}
                  onVote={castVote}
                  isWinner={isEnded && winner && !winner.tie && winner.addr.toLowerCase() === c.addr.toLowerCase()}
                  color={CHART_COLORS[candidates.findIndex((x) => x.addr === c.addr) % CHART_COLORS.length]}
                />
              ))}

              {!isOwner && isActive && !myRegistered && (
                <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: '#FAEEDA', border: '0.5px solid #BA7517', fontSize: 12, color: '#854F0B' }}>
                  Your address is not registered as a voter. Ask the contract owner to register you.
                </div>
              )}
              {!isOwner && isActive && myRegistered && myVoted && (
                <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: '#EAF3DE', border: '0.5px solid #639922', fontSize: 12, color: '#3B6D11' }}>
                  Your vote has been recorded. Results update live.
                </div>
              )}
            </Card>

            <Card>
              <SectionTitle>Vote Distribution</SectionTitle>
              <DonutChart candidates={candidates} totalVotes={totalVotes} />
            </Card>

            {isEnded && winner && (
              <Card>
                <SectionTitle>Result - Round #{roundNumber}</SectionTitle>
                {winner.tie ? (
                  <div style={{ padding: '12px 16px', borderRadius: 8, background: '#FAEEDA', border: '0.5px solid #BA7517' }}>
                    <div style={{ fontWeight: 700, color: '#854F0B', fontSize: 16 }}>It's a tie</div>
                    <div style={{ fontSize: 13, color: '#854F0B', marginTop: 4 }}>Highest vote count: {winner.votes}</div>
                    <div style={{ fontSize: 12, color: '#854F0B', marginTop: 2 }}>Multiple candidates share the lead.</div>
                  </div>
                ) : (
                  <div style={{ padding: '12px 16px', borderRadius: 8, background: '#EAF3DE', border: '0.5px solid #639922' }}>
                    <div style={{ fontWeight: 700, color: '#27500A', fontSize: 16 }}>Winner</div>
                    <code style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#3B6D11', marginTop: 6, wordBreak: 'break-all' }}>
                      {winner.addr}
                    </code>
                    <div style={{ fontSize: 13, color: '#27500A', marginTop: 6, fontWeight: 600 }}>
                      {winner.votes} vote{winner.votes !== 1 ? 's' : ''}
                      {totalVotes > 0 && ` - ${Math.round((winner.votes / totalVotes) * 100)}% of total`}
                    </div>
                  </div>
                )}
                {isOwner && (
                  <div style={{ marginTop: 12 }}>
                    <Btn onClick={resetVoting} disabled={loading} bg="#EEEDFE" color="#533490" style={{ width: '100%' }}>
                      Start New Round
                    </Btn>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>

        <Card>
          <SectionTitle right={`${logs.length} entries`}>Transaction Log</SectionTitle>
          <TxLog logs={logs} />
        </Card>
      </div>

      {loading && <FullScreenLoader label={loaderLabel} />}
    </div>
  )
}
