export const collectPreorderNodes = (node, result = []) => {
    if (!node) return
    result.push({ node, step: 0 })
    result.push({ node, step: 1 })
    if (node.children && node.children[0]) collectPreorderNodes(node.children[0], result)
    result.push({ node, step: 2 })
    if (node.children && node.children[1]) collectPreorderNodes(node.children[1], result)
    result.push({ node, step: 3 })
}

export const collectInorderNodes = (node, result = []) => {
    if (!node) return
    result.push({ node, step: 0 })
    if (node.children && node.children[0]) collectInorderNodes(node.children[0], result)
    result.push({ node, step: 1 })
    result.push({ node, step: 2 })
    if (node.children && node.children[1]) collectInorderNodes(node.children[1], result)
    result.push({ node, step: 3 })
}

export const collectPostorderNodes = (node, result = []) => {
    if (!node) return
    result.push({ node, step: 0 })
    if (node.children && node.children[0]) collectPostorderNodes(node.children[0], result)
    result.push({ node, step: 1 })
    if (node.children && node.children[1]) collectPostorderNodes(node.children[1], result)
    result.push({ node, step: 2 })
    result.push({ node, step: 3 })
}