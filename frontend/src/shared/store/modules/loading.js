let loadingCount = 0

export const useLoading = () => {
  const show = () => { loadingCount++ }
  const hide = () => { loadingCount = Math.max(0, loadingCount - 1) }
  const isLoading = () => loadingCount > 0
  return { isLoading, show, hide }
}
