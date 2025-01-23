// pmo-app/frontend/src/components/SectorsTree.js
import React, { useEffect, useState } from 'react';

/**
 * Construye la estructura de árbol a partir de la lista plana de sectores.
 * - sectors: array de objetos { id, name, dependency_id, ... }
 * - rootName: por defecto 'Company'
 */
function buildSectorTree(sectors, rootName = 'Company') {
  const map = {};

  // 1. Creamos un diccionario id => nodo con "children": []
  sectors.forEach((sec) => {
    map[sec.id] = { ...sec, children: [] };
  });

  let root = null;

  // 2. Vinculamos cada sector con su padre, o lo marcamos como raíz
  sectors.forEach((sec) => {
    const current = map[sec.id];
    if (sec.name === rootName) {
      // Sector raíz (Company)
      root = current;
    } else if (sec.dependency_id && map[sec.dependency_id]) {
      // Añadimos este sector a la lista de hijos de su dependencia
      map[sec.dependency_id].children.push(current);
    }
  });

  return root;
}

/**
 * Renderiza recursivamente un nodo del árbol como <li>, 
 * anidando hijos en <ul>.
 */
function TreeNode({ node }) {
  return (
    <li>
      <div className="tree-node-label">{node.name}</div>
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Componente principal que recibe la lista "sectors",
 * construye un árbol y lo muestra usando <ul>/<li> anidados.
 */
function SectorsTree({ sectors }) {
  const [rootNode, setRootNode] = useState(null);

  useEffect(() => {
    if (sectors && sectors.length > 0) {
      const tree = buildSectorTree(sectors, 'Company');
      setRootNode(tree);
    }
  }, [sectors]);

  if (!rootNode) {
    return <div>No se encontró el sector raíz "Company" o no hay datos.</div>;
  }

  return (
    <div className="tree-container">
      <h3>Árbol de Sectores</h3>
      <ul className="tree">
        <TreeNode node={rootNode} />
      </ul>
    </div>
  );
}

export default SectorsTree;
