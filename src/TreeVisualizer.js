import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './TreeVisualizer.css'
import { collectPreorderNodes,collectPostorderNodes,collectInorderNodes } from './dfsAlgorithms'

const TreeVisualizer = () => {
    // counter for unique node numbers
    const [nodeCounter, setNodeCounter] = useState(2)

    // structure of the tree. starting with a root node 1 and no children
    const [treeData, setTreeData] = useState({
        name: 1,
        children: [],
    })

    // to create and render the tree structure in the SVG
    const create = (svg) => {
        // removes all existing elements in the SVG to prevent overlap
        svg.selectAll("*").remove()

        // converts the tree data into a hierarchy.
        const root = d3.hierarchy(treeData)

        // creates a tree layout dimensions and applies it to the hierarchy.
        const treeLayout = d3.tree().size([800, 450])
        treeLayout(root)

        // Links
        // binds the links data to line elements
        svg.selectAll('line').data(root.links())
            // creates new line elements for each link.
            .enter().append('line')
            // set the start (x1, y1) and end (x2, y2) coordinates of each line based on the positions of the parent and child nodes
            .attr('x1', d => d.source.x + 50)
            .attr('y1', d => d.source.y + 50)
            .attr('x2', d => d.target.x + 50)
            .attr('y2', d => d.target.y + 50)
            // set the line color to black
            .attr('stroke', 'white')

        // Nodes
        // binds the nodes data to 'g' group elements that can contain multiple child elements
        const nodes = svg.selectAll('g').data(root.descendants())
            // creates new g elements for each node. 
            .enter().append('g')
            // sets the position of each node.
            .attr('transform', d => `translate(${d.x + 50}, ${d.y + 50})`)

        // create a circle for each node
        nodes.append('circle')
            .attr('r', 20)
            .attr('fill', 'skyblue')
            .attr('stroke', 'white') // add outline color
            .attr('stroke-width', 1) // outline width
            // if node is clicked. 'd' is the object representing the node and its children
            .on('click', (event,d) => {
                if (d.data.children && d.data.children.length >= 2) {
                    alert('A node can have at most 2 children.')
                    return
                }

                // create a new child node and increment nodeCounter
                const newNodeName = `${nodeCounter}`
                const newNode = { name: newNodeName, children: [] }
                setNodeCounter(nodeCounter + 1)

                if (newNode) {
                    // if the clicked node (d.data) does not have children, initializes an empty array
                    if (!d.data.children) {
                        d.data.children = []
                    }
                    // add new child node to the children array of the clicked node
                    d.data.children.push(newNode)
                    // update the state of the treeData to render
                    setTreeData({ ...treeData })
                }
            })

        // add text node numbers to each node
        nodes.append('text')
            .attr('dy', 5)
            .attr('text-anchor', 'middle')
            .text(d => d.data.name)
    }

    // highlights a node by name
    const highlightNode = (nodeName, flash = false, color = 'orange') => {
        const node = d3.select(svgRef.current).selectAll('circle')
            .filter(d => d.data && d.data.name === nodeName)
        node.attr('fill', color)

        if (flash) {
            setTimeout(() => {
                node.attr('fill', 'skyblue')
            }, 500)
        }
    }

    // highlight a nodes psuedocode
    const highlightStep = (nodeName, stepIndex) => {
        d3.select(svgRef.current).selectAll('g')
            .filter(d => d.data && d.data.name === nodeName)
            .selectAll('.pseudo-step')
            .attr('fill', (d, i) => `step-${i}` === `step-${stepIndex}` ? 'red' : 'black')
    }

    // show pseudocode depending on the diffrent algo 
    const showPseudocodeSteps = (s) => {
        const pseudocodeSteps = [
            'Visit this node',
            'Visit left node',
            'Visit right node',
            'End'
        ]

        const nodes = d3.select(svgRef.current).selectAll('g')
        nodes.each(function(d) {
            const nodeGroup = d3.select(this)
            s.forEach((step, index) => {
                nodeGroup.append('text')
                    .attr('x', d.data.children && d.data.children.length > 0 ? -50 : 0)
                    .attr('dy', d.data.children && d.data.children.length > 0 ? -10 + index * 10 : 30 + index * 10)
                    .attr('class', `pseudo-step step-${index}`)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '9px')
                    .text(pseudocodeSteps[step])
            })
        })
    }

    // Display psuedocode, call preorder traversal and highlight nodes and pseudo code steps
    const startPreorderTraversal = () => {
        const s = [0,1,2,3]
        showPseudocodeSteps(s)
        const nodes = []
        // nodes array is passed in as a reference and modified in place 
        collectPreorderNodes(d3.hierarchy(treeData), nodes)

        nodes.forEach((step, index) => {
            setTimeout(() => {
                if (step.step === 0) {
                    highlightNode(step.node.data.name)
                }
                else if (step.step === 3){
                    highlightNode(step.node.data.name, false, 'darkgrey')
                }
                highlightStep(step.node.data.name, step.step)
            }, index * 500)
        })
    }

    // Display psuedocode, call inorder traversal and highlight nodes and pseudo code steps
    const startInorderTraversal = () => {
        const s = [1,0,2,3]
        showPseudocodeSteps(s)
        const nodes = []
        collectInorderNodes(d3.hierarchy(treeData), nodes)
        
        nodes.forEach((step, index) => {
            setTimeout(() => {
                if (step.step === 1) {
                    highlightNode(step.node.data.name)
                }
                else if (step.step === 3){
                    highlightNode(step.node.data.name, false, 'darkgrey')
                }
                highlightStep(step.node.data.name, step.step)
            }, index * 500)
        })
    }

    // Display psuedocode, call postorder traversal and highlight nodes and pseudo code steps
    const startPostorderTraversal = () => {
        const s = [1,2,0,3]
        showPseudocodeSteps(s)
        const nodes = []
        collectPostorderNodes(d3.hierarchy(treeData), nodes)
        
        nodes.forEach((step, index) => {
            setTimeout(() => {
                if (step.step === 2) {
                    highlightNode(step.node.data.name)
                }
                else if (step.step === 3){
                    highlightNode(step.node.data.name, false, 'darkgrey')
                }
                highlightStep(step.node.data.name, step.step)
            }, index * 500)
        })
    }

    // run BFS traversal and highlight parent and child nodes
    const startBFS = () => {
        const queue = [d3.hierarchy(treeData)]
        let delay = 0

        while (queue.length > 0) {
            const parent = queue.shift()
           
            setTimeout(() => {
                highlightNode(parent.data.name, false, 'green')
                console.log(queue)
            }, delay)
            delay += 1000;

            (parent.children || []).forEach((child) => {
                queue.push(child)
                
                setTimeout(() => {
                    highlightNode(child.data.name, true)
                    console.log(queue)
                }, delay)
                delay += 1000;
            })

        }
    }

    // reference the SVG element in the DOM
    const svgRef = useRef()

    // create the tree visualization whenever treeData changes
    useEffect(() => {
        const svg = d3.select(svgRef.current)
                    .attr('width', 900)
                    .attr('height', 600)
        create(svg)
    }, [create,treeData])
   

    return (
        <div className='container'>
            <h2 className='title'>Binary Tree Visualizer</h2>
            <div>
                <div className='svg-container'>
                    <svg ref={svgRef}></svg>
                </div>
                <div className='button-container'>
                    <button onClick={startPreorderTraversal}>Preorder Traversal</button>
                    <button onClick={startInorderTraversal}>Inorder Traversal</button>
                    <button onClick={startPostorderTraversal}>Postorder Traversal</button>
                    <button onClick={startBFS}>BFS Traversal</button>
                    {/* render the tree again without highlights*/}
                    <button onClick={() => setTreeData({ ...treeData })}>Reset</button>
                </div>      
            </div>
        </div>  
        
    )
}

export default TreeVisualizer