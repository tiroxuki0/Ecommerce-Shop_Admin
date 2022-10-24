import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px
    }
    
    &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #888;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .wrapper_loading{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
        .loading {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          width: 2em;
      
        
        span {
          width: 0.3em;
          height: 1em;
          background-color: #898989;
        }
        
        span:nth-of-type(1) {
          animation: grow 1s -0.45s ease-in-out infinite;
        }
        
        span:nth-of-type(2) {
          animation: grow 1s -0.3s ease-in-out infinite;
        }
        
        span:nth-of-type(3) {
          animation: grow 1s -0.15s ease-in-out infinite;
        }
        
        span:nth-of-type(4) {
          animation: grow 1s ease-in-out infinite;
        }
        
        @keyframes grow {
          0%,
          100% {
            transform: scaleY(1);
          }
        
          50% {
            transform: scaleY(2);
          }
        }
      }
    }
  }
`;
