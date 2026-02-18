const SUPABASE_URL = 'https://fzwlwvzioddivveetfgk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_69lWq1VEOU36QANcumIO7w_6FdJDPTx';
const postID = window.location.pathname; // Unique ID for each post

async function initLikes() {
    const btn = document.getElementById('like-btn');
    const countEl = document.getElementById('like-count');

    // 1. Fetch current likes
    const response = await fetch(`${SUPABASE_URL}/rest/v1/likes?id=eq.${postID}&select=count`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const data = await response.json();
    if (data.length > 0) countEl.innerText = data[0].count;

    // 2. Check if user already liked (Local Storage)
    if (localStorage.getItem('liked_' + postID)) btn.classList.add('active');

    // 3. Handle click
    btn.onclick = async () => {
        // if (btn.classList.contains('active')) return;

        btn.classList.add('active');
        localStorage.setItem('liked_' + postID, 'true');
        
        // Optimistic UI update
        let currentCount = parseInt(countEl.innerText);
        countEl.innerText = currentCount + 1;

        // Upsert to Supabase (Increments or creates)
        await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_like`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ page_id: postID })
        });
    };
}
document.addEventListener('DOMContentLoaded', initLikes);
