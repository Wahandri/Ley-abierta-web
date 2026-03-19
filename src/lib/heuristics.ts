import { Document } from './jsonl';

export interface Heuristics {
    topTopic: { label: string; count: number };
    topAffected: { label: string; count: number };
    highImpactCount: number;
    averageImpact: number;
    dateRange: { oldest: string | null; newest: string | null };
    featuredDoc: Document | null;
}

export function calculateHeuristics(docs: Document[]): Heuristics | null {
    if (!docs || docs.length === 0) return null;

    // 1. Topic most frequent
    const topicCounts: Record<string, number> = {};
    docs.forEach(d => {
        if (d.topic_primary) {
            topicCounts[d.topic_primary] = (topicCounts[d.topic_primary] || 0) + 1;
        }
    });

    let topTopicCode = '';
    let topTopicCount = 0;
    for (const [topic, count] of Object.entries(topicCounts)) {
        if (count > topTopicCount) {
            topTopicCode = topic;
            topTopicCount = count;
        }
    }

    // 2. Affected group most frequent
    const affectedCounts: Record<string, number> = {};
    docs.forEach(d => {
        if (d.affects_to) {
            d.affects_to.forEach(group => {
                affectedCounts[group] = (affectedCounts[group] || 0) + 1;
            });
        }
    });

    let topAffectedCode = '';
    let topAffectedCount = 0;
    for (const [group, count] of Object.entries(affectedCounts)) {
        if (count > topAffectedCount) {
            topAffectedCode = group;
            topAffectedCount = count;
        }
    }

    // 3. High impact count & Average Impact
    let totalScore = 0;
    let highImpactCount = 0;
    
    // 5. Date boundaries
    let oldestDateStr: string | null = null;
    let newestDateStr: string | null = null;
    
    docs.forEach(d => {
        const score = d.impact_index?.score || 0;
        totalScore += score;
        if (score >= 70) highImpactCount++;
        
        const dDate = new Date(d.date_published).getTime();
        if (!isNaN(dDate)) {
            if (!oldestDateStr || dDate < new Date(oldestDateStr).getTime()) {
                oldestDateStr = d.date_published;
            }
            if (!newestDateStr || dDate > new Date(newestDateStr).getTime()) {
                newestDateStr = d.date_published;
            }
        }
    });

    const averageImpact = docs.length > 0 ? Math.round(totalScore / docs.length) : 0;

    // 4. Featured doc (highest score, tie break by date)
    let featuredDoc = docs[0];
    docs.forEach(d => {
        const currentScore = d.impact_index?.score || 0;
        const featuredScore = featuredDoc.impact_index?.score || 0;
        
        if (currentScore > featuredScore) {
            featuredDoc = d;
        } else if (currentScore === featuredScore) {
            // Tie break by date
            const dDate = new Date(d.date_published).getTime();
            const fDate = new Date(featuredDoc.date_published).getTime();
            if (dDate > fDate) {
                featuredDoc = d;
            }
        }
    });

    return {
        topTopic: { label: topTopicCode, count: topTopicCount },
        topAffected: { label: topAffectedCode, count: topAffectedCount },
        highImpactCount,
        averageImpact,
        dateRange: { oldest: oldestDateStr, newest: newestDateStr },
        featuredDoc
    };
}
